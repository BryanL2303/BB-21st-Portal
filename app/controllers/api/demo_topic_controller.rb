# frozen_string_literal: true

module Api
  # The TopicController is responsible for handling functions for Topic
  # within the API, such as CRUD functions.
  #
  # This api is currently not in use by production
  class DemoTopicController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def create_topic
      find_topic = DemoTopic.find_by(topic_name: params[:topic_name])

      if find_topic.nil?
        topic = DemoTopic.new(topic_name: params[:topic_name])
        if topic.save
          render json: { topic_name: topic.topic_name }, status: :created
        else
          render json: { error: topic.errors.messages }, status: 422
        end
      else
        render json: false, status: :reserved
      end
    end

    def topics
      topics = DemoTopic.all.order('topic_name')

      render json: topics, status: :ok
    end

    def quizzes
      topic = DemoTopic.find_by(topic_name: params[:topic_name])
      quizzes = DemoQuiz.where(demo_topic_id: topic.id)

      render json: quizzes, status: :ok
    end

    def questions
      topic = DemoTopic.find_by(topic_name: params[:topic_name])
      questions = DemoQuestion.where(demo_topic_id: topic.id, question_type: params[:question_type]).order('permanent')

      render json: questions, status: :ok
    end

    def delete_topic
      quizzes = DemoQuiz.where(demo_topic_id: params[:topic_id])
      quizzes.destroy_all
      topic = DemoTopic.find_by(topic_name: params[:topic_name])
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
