# frozen_string_literal: true

module Api
  # The HomeEditorController is responsible for handling functions for the Home Page Editor page.
  # within the API, such as CRUD functions of testimonies and achievements.
  class HomeEditorController < ApplicationController
    # protect_from_forgery with: :null_session
    # before_action :authenticate_request

    def all_testimonies
      testimonies = Testimony.all

      render json: testimonies, status: :ok
    end

    def update_testimonies
      testimonies = params.require(:_json)

      testimonies.each do |testimony|
        if testimony[:id].present? && !testimony[:id].nil?
          existing = Testimony.find_by(id: testimony[:id])
          existing&.update(
            date: testimony[:date],
            name: testimony[:name],
            testimony: testimony[:content],
            updated_at: Time.current
          )
        else
          max_id = Testimony.maximum(:id) || 0
          Testimony.create(
            id: max_id + 1,
            date: testimony[:date],
            name: testimony[:name],
            testimony: testimony[:content],
            created_at: Time.current,
            updated_at: Time.current
          )
        end
      end

      render json: true, status: :accepted
    end

    def delete_testimony
      logger.debug "Received params: #{params.inspect}"
      record = Testimony.find_by(id: params[:testimony_id])
      if record
        record.destroy
        render json: true, status: :ok
      else
        render json: false, status: :not_found
      end
    end
  end
end
