# frozen_string_literal: true

module Api
  # The TopicController is responsible for handling functions for Topic
  # within the API, such as CRUD functions.
  #
  # This api is currently not in use by production
  class TopicController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def create_topic
      find_topic = Topic.find_by(topic_name: params[:topic_name])

      if find_topic.nil?
        topic = Topic.new(topic_name: params[:topic_name])
        if topic.save
          render json: { topic_name: topic.topic_name }
        else
          render json: { error: topic.errors.messages }, status: 422
        end
      else
        render json: false
      end
    end

    def topics
      topics = Topic.all.order('topic_name')

      render json: topics
    end

    def quizzes
      topic = Topic.find_by(topic_name: params[:topic_name])
      quizzes = Quiz.where(topic_id: topic.id)

      render json: quizzes
    end

    def questions
      topic = Topic.find_by(topic_name: params[:topic_name])
      questions = Question.where(topic_id: topic.id, question_type: params[:question_type]).order('permanent')

      render json: questions
    end

    def delete_topic
      quizzes = Quiz.where(topic_id: params[:topic_id])
      quizzes.destroy_all
      topic = Topic.find_by(topic_name: params[:topic_name])
      # Need to loop through all replies, comments and topics related to this account
      # and delete them all

      if topic.destroy
        head :no_content
      else
        render json: { error: topic.errors.messages }, status: 422
      end
    end
  end
end
