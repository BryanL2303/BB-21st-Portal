# frozen_string_literal: true

module Api
  # The UniformInspectionController is responsible for handling functions for UniformInspection
  # within the API which includes SelectedComponent, such as CRUD functions.
  class UniformInspectionController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def create_uniform_inspection
      assessor_id = @current_user.id
      params[:boys].each do |boy|
        uniform_inspection = UniformInspection.new(account_id: boy['id'], assessor_id:, date: params[:date])
        uniform_inspection.save
        total_score = 0
        components = UniformComponent.all.order('id')
        components.each do |component|
          fields = ComponentField.where(uniform_component_id: component.id)
          fields.each do |field|
            next unless params[:selectedContents][boy['id'].to_s][component.id.to_s][field.id.to_s]

            selected_component = SelectedComponent.new(uniform_inspection_id: uniform_inspection.id,
                                                       component_field_id: field.id)
            selected_component.save
            total_score += ComponentField.find_by(id: field.id).score
          end
        end
        uniform_inspection.total_score = total_score
        uniform_inspection.save

        remarks = params[:remarks][boy['id'].to_s]
        remarks&.each do |component_id, remark|
          next if remark.blank?

          puts remark
          puts component_id
          puts uniform_inspection.id
          uniform_remark = UniformRemark.new(inspection_id: uniform_inspection.id, component_id:, remarks: remark)
          uniform_remark.save
        end
      end

      render json: true, status: :created
    end

    def inspection
      inspection = UniformInspection.find_by(id: params[:id])
      accounts = Account.where(account_type: 'Boy').order('id')
      boy = Account.find_by(id: inspection.account_id)
      inspections = {}
      boys = []
      accounts.each do |account|
        account_inspections = UniformInspection.where(account_id: account.id).order('id').reverse_order
        next unless account_inspections != []

        boys.push(account)
        inspections[account.id] = { 'inspections': account_inspections }
        inspections[account.id]['keys'] = []
        account_inspections.each do |account_inspection|
          selected_components = SelectedComponent.where(uniform_inspection_id: account_inspection.id)
          component_ids = {}
          selected_components.each do |selected_component|
            component_ids[selected_component.component_field_id] = true
          end
          assessor = Account.find_by(id: account_inspection.assessor_id)
          inspections[account.id][account_inspection.id] =
            { selected_components: component_ids, inspection: account_inspection, assessor: }
          inspections[account.id]['keys'].append(account_inspection.id)
        end
      end

      remarks = UniformRemark.where(inspection_id: params[:id])
      data = { 'boy': boy, 'inspections': inspections, 'boys': boys, 'remarks': remarks }

      render json: data, status: :ok
    end

    def inspections_summary
      accounts = Account.where(account_type: 'Boy').order('level').order('account_name')
      data = { 'boys': accounts }
      accounts.each do |account|
        inspection = UniformInspection.where(account_id: account.id).order('created_at')[-1]
        data[account.id] = inspection
        data[inspection.assessor_id] = Account.find_by(id: inspection.assessor_id) unless inspection.nil?
      end

      render json: data, status: :ok
    end

    def component_fields
      uniform_components = UniformComponent.all.order('id')
      components = []
      data = {}
      uniform_components.each do |component|
        fields = ComponentField.where('uniform_component_id': component.id)
        components.push(component)
        data[component['component_name']] = fields
      end
      data['components'] = components
      render json: data, status: :ok
    end

    def delete_uniform_inspection
      assignment = Assignment.find_by(id: params[:id])

      assigned_accounts = AssignedAccount.where(assignment_id: params[:id])
      assigned_accounts.each do |assigned_account|
        attempt_scores = AttemptScore.where(assigned_account_id: assigned_account.id)
        attempt_scores.destroy_all
        assignment_answers = AssignmentAnswer.where(account_id: assigned_account.account_id)
                                             .where(assignment_id: assigned_account.assignment_id)
        assignment_answers.destroy_all
      end
      assigned_accounts.destroy_all

      quiz_id = assignment['quiz_id']

      if assignment.destroy
        assignments = Assignment.where(quiz_id:)
        if assignments.nil?
          quiz = Quiz.find_by(id: quiz_id)
          quiz['assigned'] = false
          quiz.save
        end
        head :no_content
      else
        render json: { error: assignment.errors.messages }, status: 422
      end
    end

    def inspection_results_by_account
      user_id = @current_user.id
      data = UniformInspection.where(account_id: user_id)
      render json: data, status: :ok
    end

    def inspection_results_simplified
      inspection_id = params[:inspection_id]
      details = UniformInspection
                .joins('INNER JOIN accounts ON accounts.id = uniform_inspections.assessor_id')
                .select('uniform_inspections.*, accounts.account_name AS assessor_name')
                .where(id: inspection_id)
                .first

      remarks = UniformRemark.where(inspection_id:)

      fields = SelectedComponent.where(uniform_inspection_id: inspection_id)
      subheadings = ComponentField.all
      headings = UniformComponent.all
      render json: {
        details: details.as_json,
        checked: fields.as_json,
        subheadings: subheadings.as_json,
        headings: headings.as_json,
        remarks:
      }, status: :ok
    end
  end
end
