# frozen_string_literal: true

module Api
  # The AccountController is responsible for handling account related actions
  # within the API, such as CRUD functions for users and filtered get functions.
  #
  # This controller should include functions that relates to the table Account
  class DemoAccountController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request,
                  only: %i[create_account get_account get_accounts get_own_account toggle_type edit_account
                           delete_account get_assignments]

    def create_account
      account = DemoAccount.new(account_name: params[:account_name], password: params[:password],
                            account_type: params[:account_type], rank: params[:rank], credentials: params[:credentials])
      account['level'] = params[:level] unless params[:level].nil?
      find_account = DemoAccount.find_by(account_name: params[:account_name])

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
      account = DemoAccount.find_by(account_name: params[:account_name])
      if account.nil?
        render json: false, status: :not_found
      elsif account.password == params[:password]
        token = encode_token({ user_id: account.id })
        cookies[:jwt] = { value: token, httponly: true, secure: Rails.env.production?, same_site: :strict }

        render json: { account_name: account.account_name, account_type: account.account_type }, status: :accepted
      else
        render json: false, status: :not_acceptable
      end
    end

    def account
      account = DemoAccount.find_by(id: params[:id])

      render json: account, status: :ok
    end

    def accounts_by_type
      accounts = DemoAccount.where(account_type: params[:account_type]).order('level').order('account_name')

      render json: accounts, status: :ok
    end

    def own_account
      render json: @current_user, status: :ok
    end

    def accounts_by_ids
      accounts = DemoAccount.where(id: params[:boy_ids]).order('level').order('account_name')

      render json: accounts, status: :ok
    end

    def toggle_type
      account = DemoAccount.find_by(account_type: params[:account_type])
      account.type = params[:new_type]
      if account.save
        render json: true, status: :accepted
      else
        render json: false, status: :not_acceptable
      end
    end

    def edit_account
      account = DemoAccount.find_by(id: params[:id])

      name_clash = DemoAccount.find_by(account_name: params[:account_name])
      if name_clash.nil? || name_clash['id'] == account.id
        account['account_name'] = params[:account_name]
        account['account_type'] = params[:account_type]
        account['password'] = params[:password] unless params[:password].nil?
        account['rank'] = params[:rank]
        account['level'] = params[:level]
        account['credentials'] = params[:credentials]
        account.save
        render json: true, status: :accepted
      else
        render json: { error: account.errors.messages }, status: 422
      end
    end

    def delete_account
      account = DemoAccount.find_by(account_name: params[:account_name])

      if account.destroy
        head :no_content
      else
        render json: { error: account.errors.messages }, status: 422
      end
    end

    def assignments
      account_id = @current_user.id

      assignments = if params[:award]['masteryId'] == '0'
                      DemoAssignment.where(demo_award_id: params[:award]['awardId']).order('id')
                    else
                      DemoAssignment.where(demo_mastery_id: params[:award]['masteryId']).order('id')
                    end
      quizzes = []
      assignments.each do |assignment|
        assigned_assignments = DemoAssignedAccount.where(demo_assignment_id: assignment.id).where(demo_account_id: account_id)
        if assigned_assignments != []
          quiz = DemoQuiz.find_by(id: assignment.demo_quiz_id)
          quizzes.append(quiz)
        end
      end

      render json: quizzes, status: :ok
    end

    def account_information
      account = DemoAccount.find_by(id: params[:id])

      render json: account, status: :ok
    end

    def destroy
      account = DemoAccount.find_by(id: params[:id])

      if account.destroy
        head :no_content
      else
        render json: { error: account.errors.messages }, status: 422
      end
    end
  end
end
