# frozen_string_literal: true

module Api
  # The UniformInspectionController is responsible for handling functions for UniformInspection
  # within the API which includes SelectedComponent, such as CRUD functions.
  class DemoUniformInspectionController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def create_uniform_inspection
      assessor_id = @current_user.id
      params[:boys].each do |boy|
        uniform_inspection = DemoUniformInspection.new(demo_account_id: boy['id'], assessor_id:, date: params[:date])
        uniform_inspection.save
        total_score = 0
        components = DemoUniformComponent.all.order('id')
        components.each do |component|
          fields = DemoComponentField.where(demo_uniform_component_id: component.id)
          fields.each do |field|
            next unless params[:selectedContents][boy['id'].to_s][component.id.to_s][field.id.to_s]

            selected_component = DemoSelectedComponent.new(demo_uniform_inspection_id: uniform_inspection.id,
                                                       demo_component_field_id: field.id)
            selected_component.save
            total_score += ComponentField.find_by(id: field.id).score
          end
        end
        uniform_inspection.total_score = total_score
        uniform_inspection.save
      end

      render json: true, status: :created
    end

    def inspection
      inspection = DemoUniformInspection.find_by(id: params[:id])
      accounts = DemoAccount.where(account_type: 'Boy').order('id')
      boy = DemoAccount.find_by(id: inspection.demo_account_id)
      inspections = {}
      boys = []
      accounts.each do |account|
        account_inspections = DemoUniformInspection.where(demo_account_id: account.id).order('id').reverse_order
        next unless account_inspections != []

        boys.push(account)
        inspections[account.id] = { 'inspections': account_inspections }
        inspections[account.id]['keys'] = []
        account_inspections.each do |account_inspection|
          selected_components = DemoSelectedComponent.where(demo_uniform_inspection_id: account_inspection.id)
          component_ids = {}
          selected_components.each do |selected_component|
            component_ids[selected_component.component_field_id] = true
          end
          assessor = DemoAccount.find_by(id: account_inspection.demo_assessor_id)
          inspections[account.id][account_inspection.id] =
            { selected_components: component_ids, inspection: account_inspection, assessor: }
          inspections[account.id]['keys'].append(account_inspection.id)
        end
      end
      data = { 'boy': boy, 'inspections': inspections, 'boys': boys }

      render json: data, status: :ok
    end

    def inspections_summary
      accounts = DemoAccount.where(account_type: 'Boy').order('level').order('account_name')
      data = { 'boys': accounts }
      accounts.each do |account|
        inspection = DemoUniformInspection.where(demo_account_id: account.id).order('created_at')[-1]
        data[account.id] = inspection
        data[inspection.demo_assessor_id] = DemoAccount.find_by(id: inspection.demo_assessor_id) unless inspection.nil?
      end

      render json: data, status: :ok
    end

    def component_fields
      uniform_components = DemoUniformComponent.all.order('id')
      components = []
      data = {}
      uniform_components.each do |component|
        fields = DemoComponentField.where('demo_uniform_component_id': component.id)
        components.push(component)
        data[component['component_name']] = fields
      end
      data['components'] = components
      render json: data, status: :ok
    end

    def delete_uniform_inspection
      assignment = DemoAssignment.find_by(id: params[:id])

      assigned_accounts = DemoAssignedAccount.where(demo_assignment_id: params[:id])
      assigned_accounts.each do |assigned_account|
        attempt_scores = DemoAttemptScore.where(demo_assigned_account_id: assigned_account.id)
        attempt_scores.destroy_all
        assignment_answers = DemoAssignmentAnswer.where(demo_account_id: assigned_account.demo_account_id)
                                             .where(demo_assignment_id: assigned_account.demo_assignment_id)
        assignment_answers.destroy_all
      end
      assigned_accounts.destroy_all

      quiz_id = assignment['quiz_id']

      if assignment.destroy
        assignments = DemoAssignment.where(demo_quiz_id: quiz_id)
        if assignments.nil?
          quiz = DemoQuiz.find_by(id: quiz_id)
          quiz['assigned'] = false
          quiz.save
        end
        head :no_content
      else
        render json: { error: assignment.errors.messages }, status: 422
      end
    end
  end
end
