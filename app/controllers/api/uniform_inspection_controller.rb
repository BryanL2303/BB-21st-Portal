# frozen_string_literal: true

module Api
  class UniformInspectionController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def createUniformInspection
      assessorId = @current_user.id
      params[:boys].each do |boy|
        uniformInspection = UniformInspection.new(account_id: boy['id'], assessor_id: assessorId, date: params[:date])
        uniformInspection.save
        totalScore = 0
        components = UniformComponent.all.order('id')
        components.each do |component|
          fields = ComponentField.where(uniform_component_id: component.id)
          fields.each do |field|
            next unless params[:selectedContents][boy['id'].to_s][component.id.to_s][field.id.to_s]

            selectedComponent = SelectedComponent.new(uniform_inspection_id: uniformInspection.id,
                                                      component_field_id: field.id)
            selectedComponent.save
            totalScore += ComponentField.find_by(id: field.id).score
          end
        end
        uniformInspection.total_score = totalScore
        uniformInspection.save
      end

      render json: true
    end

    def getInspection
      inspection = UniformInspection.find_by(id: params[:id])
      accounts = Account.where(account_type: 'Boy').order('id')
      boy = Account.find_by(id: inspection.account_id)
      inspections = {}
      boys = []
      accounts.each do |account|
        accountInspections = UniformInspection.where(account_id: account.id).order('id').reverse_order
        next unless accountInspections != []

        boys.push(account)
        inspections[account.id] = { 'inspections': accountInspections }
        inspections[account.id]['keys'] = []
        accountInspections.each do |accountInspection|
          selectedComponents = SelectedComponent.where(uniform_inspection_id: accountInspection.id)
          componentIds = {}
          selectedComponents.each do |selectedComponent|
            componentIds[selectedComponent.component_field_id] = true
          end
          assessor = Account.find_by(id: accountInspection.assessor_id)
          inspections[account.id][accountInspection.id] =
            { selectedComponents: componentIds, inspection: accountInspection, assessor: }
          inspections[account.id]['keys'].append(accountInspection.id)
        end
      end
      data = { 'boy': boy, 'inspections': inspections, 'boys': boys }

      render json: data
    end

    def getInspectionsSummary
      accounts = Account.where(account_type: 'Boy').order('level').order('account_name')
      data = { 'boys': accounts }
      accounts.each do |account|
        inspection = UniformInspection.where(account_id: account.id).order('created_at')[-1]
        data[account.id] = inspection
        data[inspection.assessor_id] = Account.find_by(id: inspection.assessor_id) unless inspection.nil?
      end

      render json: data
    end

    def getComponentFields
      uniformComponents = UniformComponent.all.order('id')
      components = []
      data = {}
      uniformComponents.each do |component|
        fields = ComponentField.where('uniform_component_id': component.id)
        components.push(component)
        data[component['component_name']] = fields
      end
      data['components'] = components
      render json: data
    end

    def deleteUniformInspection
      assignment = Assignment.find_by(id: params[:id])

      assigned_accounts = AssignedAccount.where(assignment_id: params[:id])
      assigned_accounts.each do |assigned_account|
        attemptScores = AttemptScore.where(assigned_account_id: assigned_account.id)
        attemptScores.destroy_all
        assignmentAnswers = AssignmentAnswer.where(account_id: assigned_account.account_id).where(assignment_id: assigned_account.assignment_id)
        assignmentAnswers.destroy_all
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
  end
end
