# frozen_string_literal: true

module Api
  # The HomeEditorController is responsible for handling functions for the Home Page Editor page.
  # within the API, such as CRUD functions of testimonies and achievements.
  class HomeEditorController < ApplicationController
    protect_from_forgery with: :null_session

    def all_testimonies
      testimonies = Testimony.all

      render json: testimonies, status: :ok
    end

    def update_testimonies
      testimonies = params.require(:_json)

      testimonies.each do |testimony|
        if testimony[:id].present?
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
      record = Testimony.find_by(id: params[:testimony_id])
      if record
        record.destroy
        render json: true, status: :ok
      else
        render json: false, status: :not_found
      end
    end

    def all_achievements
      achievements = Achievement.all

      render json: achievements, status: :ok
    end

    def update_achievements
      achievements = params.require(:_json)

      achievements.each do |achievement|
        if achievement[:id].present?
          existing = Achievement.find_by(id: achievement[:id])
          existing&.update(
            year: achievement[:date],
            achievement: achievement[:achievement],
            updated_at: Time.current
          )
        else
          max_id = Achievement.maximum(:id) || 0
          Achievement.create(
            id: max_id + 1,
            year: achievement[:date],
            achievement: achievement[:achievement],
            created_at: Time.current,
            updated_at: Time.current
          )
        end
      end

      render json: true, status: :accepted
    end

    def delete_achievement
      record = Achievement.find_by(id: params[:achievement_id])
      if record
        record.destroy
        render json: true, status: :ok
      else
        render json: false, status: :not_found
      end
    end

    def show
      images = Image.order(:order).map do |image|
        {
          id: image.id,
          image: Base64.encode64(image.image),
          order: image.order,
          created_at: image.created_at,
          updated_at: image.updated_at
        }
      end

      render json: images, status: :ok
    end

    def upload_image
      file = params[:file]

      if file.present?
        image_data = file.read
        image = Image.new(image: image_data)
        image.created_at = Time.current
        image.updated_at = Time.current
        if image.save
          render json: {
            id: image.id,
            image: Base64.encode64(image.image)
          }, status: :created
        else
          render json: false, status: 422
        end
      else
        render json: false, status: 422
      end
    end

    def delete_image
      record = Image.find_by(id: params[:image_id])
      if record
        record.destroy
        render json: true, status: :ok
      else
        render json: false, status: :not_found
      end
    end

    def update_image
      new_images = params.require(:_json)

      if new_images.nil?
        render json: false, status: 422
        return
      end

      new_images.each do |image|
        record = Image.find_by(id: image[:id])
        record&.update(
          updated_at: Time.current,
          order: image[:order]
        )
      end

      render json: true, status: :accepted
    end
  end
end
