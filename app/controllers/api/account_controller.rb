module Api
  class AccountController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request,
                  only: %i[createAccount getAccount getAccounts getOwnAccount toggleType editAccount deleteAccount
                           getAssignments]

    def createAccount
      account = Account.new(account_name: params[:account_name], password: params[:password],
                            account_type: params[:account_type], rank: params[:rank], credentials: params[:credentials])
      account['level'] = params[:level] unless params[:level].nil?
      findAccount = Account.find_by(account_name: params[:account_name])

      if findAccount.nil?
        if account.save
          render json: { account_name: account.account_name, type: account.account_type }
        else
          render json: { error: account.errors.messages }, status: 422
        end
      else
        render json: false
      end
    end

    def authenticateAccount
      account = Account.find_by(account_name: params[:account_name])
      if account.nil?
        render json: false
      elsif account.password == params[:password]
        token = encode_token({ user_id: account.id })
        cookies[:jwt] = { value: token, httponly: true, secure: Rails.env.production?, same_site: :strict }

        render json: { account_name: account.account_name, account_type: account.account_type }
      else
        render json: false
      end
    end

    def getAccount
      account = Account.find_by(id: params[:id])

      render json: account
    end

    def getAccounts
      accounts = Account.where(account_type: params[:account_type]).order('level').order('account_name')

      render json: accounts
    end

    def getOwnAccount
      render json: @current_user
    end

    def getAccountsByIds
      accounts = Account.where(id: params[:boy_ids]).order('level').order('account_name')

      render json: accounts
    end

    def toggleType
      account = Account.find_by(account_type: params[:account_type])
      account.type = params[:new_type]
      if account.save
        render json: true
      else
        render json: false
      end
    end

    def editAccount
      account = Account.find_by(id: params[:id])

      nameClash = Account.find_by(account_name: params[:account_name])
      if nameClash.nil? || nameClash['id'] == account.id
        account['account_name'] = params[:account_name]
        account['account_type'] = params[:account_type]
        account['password'] = params[:password] unless params[:password].nil?
        account['rank'] = params[:rank]
        account['level'] = params[:level]
        account['credentials'] = params[:credentials]
        account.save
        render json: true
      else
        render json: { error: account.errors.messages }, status: 422
      end
    end

    def deleteAccount
      account = Account.find_by(account_name: params[:account_name])

      if account.destroy
        head :no_content
      else
        render json: { error: account.errors.messages }, status: 422
      end
    end

    def getAssignments
      accountId = @current_user.id

      assignments = if params[:award]['masteryId'] == '0'
                      Assignment.where(award_id: params[:award]['awardId']).order('id')
                    else
                      Assignment.where(mastery_id: params[:award]['masteryId']).order('id')
                    end
      quizzes = []
      for assignment in assignments
        assignedAssignments = AssignedAccount.where(assignment_id: assignment.id).where(account_id: accountId)
        if assignedAssignments != []
          quiz = Quiz.find_by(id: assignment.quiz_id)
          quizzes.append(quiz)
        end
      end

      render json: quizzes
    end

    def getAccountInformation
      account = Account.find_by(id: params[:id])

      render json: account
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
