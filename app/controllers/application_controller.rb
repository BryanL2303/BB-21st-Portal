# frozen_string_literal: true

class ApplicationController < ActionController::Base
  def encode_token(payload)
    payload[:exp] = 24.hours.from_now.to_i
    JWT.encode(payload, ENV['JWT_SECRET'], 'HS256')
  end

  def decode_token(token)
    payload = JWT.decode(token, ENV['JWT_SECRET'], true, algorithm: 'HS256')
    payload[0]['user_id']
  rescue JWT::DecodeError
    nil
  end

  def authorised_user(token)
    account_id = decode_token(token)
    return if account_id.nil?

    Account.find_by(id: account_id)
  end

  def authenticate_request
    token = cookies[:jwt] # Retrieving the token from the signed cookie
    Rails.logger.info("Token: #{token}")
    if token.present?
      account_id = decode_token(token)
      @current_user = Account.find_by(id: account_id) if account_id
    end

    return if @current_user

    render json: { error: 'Not Authorized' }, status: :unauthorized
  end

  def check_session
    Rails.logger.info('Authenticating request')
    authenticate_request
    return unless @current_user

    render json: true
  end

  def log_out
    cookies.delete(:jwt, secure: Rails.env.production?, same_site: :strict, domain: :ENV['domain'])
    render json: true
  end
end
