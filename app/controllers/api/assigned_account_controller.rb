module Api
	class AssignedAccountController < ApplicationController
		protect_from_forgery with: :null_session

		def createAssignedAccount
			account = Account.new(account_name: params[:account_name], password: params[:password], account_type: params[:account_type])
			findAccount = Account.find_by(account_name: params[:account_name])

			if findAccount == nil
				if account.save
					token = encode_token({user_id: account.id})
					render json: {account_name: account.account_name, type: account.account_type, token: token}
				else
					render json: {error: account.errors.messages}, status: 422
				end
			else
				render json: false
			end
		end

		def getAssignedAccount
			accountId = decode_token(params[:token])
			assigned_accounts = AssignedAccount.where(account_id: accountId)
			assignments = Assignment.where(quiz_id: params[:quiz_id])
			for assignment in assignments
				assigned_account = assigned_accounts.find_by(assignment_id: assignment.id)
				if assigned_account != nil
					render json: assigned_account
					break
				end
			end
		end

		def getAssignedAccounts
			assigned_accounts = AssignedAccount.where(assignment_id: params[:assignment_id]).order('account_id')

			render json: assigned_accounts
		end

		def updateAccountAssigment
			assigned_account = AssignedAccount.find_by(id: params[:id])
			assigned_account.score = params[:new_score]
			assigned_account.attempts = params[:new_attempts]
			if assigned_account.save
				render json: true
			else
				render json: false
			end
		end

		def deleteAssignedAccount
			assigned_account = AssignedAccount.find_by(id: params[:id])

			if assigned_account.destroy
				head :no_content
			else
				render json: {error: assigned_account.errors.messages}, status: 422
			end
		end
	end
end