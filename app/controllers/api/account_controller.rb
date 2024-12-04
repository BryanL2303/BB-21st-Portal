# frozen_string_literal: true

module Api
  # The AccountController is responsible for handling account related actions
  # within the API, such as CRUD functions for users and filtered get functions.
  #
  # This controller should include functions that relates to the table Account
  class AccountController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request,
                  only: %i[create_account account accounts own_account toggle_type edit_account
                           delete_account assignments]

    def create_account
      account = Account.new(account_name: params[:account_name], user_name: params[:account_name],
                            password: params[:password], honorifics: params[:honorifics], roll_call: params[:roll_call],
                            abbreviated_name: params[:abbreviated_name],
                            account_type: params[:account_type], rank: params[:rank], credentials: params[:credentials])
      account['level'] = params[:level] unless params[:level].nil?
      find_account = Account.find_by(account_name: params[:account_name])

      if find_account.nil?
        if account.save
          render json: { account_name: account.account_name, type: account.account_type }, status: :created
        else
          render json: { error: account.errors.messages }, status: 422
        end
      else
        render json: false, status: :reserved
      end
    end

    def authenticate_account
      account = Account.find_by(account_name: params[:user_name])
      if account.nil?
        render json: false, status: :not_found
      elsif account.password == params[:password]
        token = encode_token({ user_id: account.id })
        cookies[:jwt] = { value: token, httponly: true, secure: Rails.env.production?, same_site: :strict }

        render json: { account_name: account.account_name, account_type: account.account_type,
                       appointment: account.appointment }, status: :accepted
      else
        render json: false, status: :not_acceptable
      end
    end

    def account
      account = Account.find_by(id: params[:id])

      render json: account, status: :ok
    end

    def accounts_by_type
      accounts = Account.where(account_type: params[:account_type]).order('level').order('account_name')

      render json: accounts, status: :ok
    end

    def own_account
      render json: @current_user, status: :ok
    end

    def accounts_by_ids
      accounts = Account.where(id: params[:boy_ids]).order('level').order('account_name')

      render json: accounts, status: :ok
    end

    def toggle_type
      account = Account.find_by(account_type: params[:account_type])
      account.type = params[:new_type]
      if account.save
        render json: true, status: :accepted
      else
        render json: false, status: :not_acceptable
      end
    end

    def edit_account
      account = Account.find_by(id: params[:id])

      name_clash = Account.find_by(account_name: params[:account_name])
      if name_clash.nil? || name_clash['id'] == account.id
        account['account_name'] = params[:account_name]
        account['account_type'] = params[:account_type]
        account['user_name'] = params[:user_name] unless params[:user_name].nil?
        account['password'] = params[:password] unless params[:password].nil?
        account['rank'] = params[:rank]
        account['roll_call'] = params[:roll_call]
        account['honorifics'] = params[:honorifics]
        account['abbreviated_name'] = params[:abbreviated_name]
        account['level'] = params[:level]
        account['credentials'] = params[:credentials]
        account.save
        render json: true, status: :accepted
      else
        render json: { error: account.errors.messages }, status: 422
      end
    end

    def delete_account
      account = Account.find_by(account_name: params[:account_name])

      if account.destroy
        head :no_content
      else
        render json: { error: account.errors.messages }, status: 422
      end
    end

    def assignments
      account_id = @current_user.id

      assignments = if params[:award]['masteryId'] == '0'
                      Assignment.where(award_id: params[:award]['awardId']).order('id')
                    else
                      Assignment.where(mastery_id: params[:award]['masteryId']).order('id')
                    end
      quizzes = []
      assignments.each do |assignment|
        assigned_assignments = AssignedAccount.where(assignment_id: assignment.id).where(account_id:)
        if assigned_assignments != []
          quiz = Quiz.find_by(id: assignment.quiz_id)
          quizzes.append(quiz)
        end
      end

      render json: quizzes, status: :ok
    end

    def account_information
      account = Account.find_by(id: params[:id])

      render json: account, status: :ok
    end

    def destroy
      account = Account.find_by(id: params[:id])

      if account.destroy
        head :no_content
      else
        render json: { error: account.errors.messages }, status: 422
      end
    end
  end
end
