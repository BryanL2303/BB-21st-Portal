class ApplicationController < ActionController::Base
	def encode_token(payload)
		payload[:exp] = 24.hours.from_now.to_i
		JWT.encode(payload, ENV['JWT_SECRET'], 'HS256')
	end

	def decode_token(token)
		begin
		  payload = JWT.decode(token, ENV['JWT_SECRET'], true, algorithm: 'HS256')
		  payload[0]["user_id"]
		rescue JWT::DecodeError => e
			nil
		end
	end

	def authorised_user(token)
		account_id = decode_token(token)
		if account_id != nil
			user = Account.find_by(id: account_id)
		else
			nil
		end
	end
	
	def authenticate_request
		token = cookies[:jwt]  # Retrieving the token from the signed cookie
		Rails.logger.info("Token: #{token}")
		if token.present?
		  account_id = decode_token(token)
		  if account_id
			@current_user = Account.find_by(id: account_id)
		  end
		end
	
		unless @current_user
		  render json: { error: 'Not Authorized' }, status: :unauthorized
		end
	end

	def check_session
		Rails.logger.info("Authenticating request")
		authenticate_request()
		if @current_user
			render json: true
		end
	end

	def log_out
		cookies.delete(:jwt, domain: :all)
		render json: true
	end
end
