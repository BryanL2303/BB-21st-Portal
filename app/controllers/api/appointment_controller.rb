# frozen_string_literal: true

module Api
  # The AppointmentController is responsible for handling appointment related actions
  # within the API, such as CRUD functions for appointments.
  #
  # This controller should include functions that relates to the table Appointment
  class DemoAppointmentController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def create_appointment
      appointment = DemoAppointment.new(appointment_name: params[:appointment_name], account_id: params[:account_id],
                                    account_type: params[:account_type])
      find_appointment = DemoAppointment.find_by(appointment_name: params[:appointment_name])

      if find_appointment.nil?
        if appointment.save
          account = DemoAccount.find_by(id: appointment.account_id)
          account.appointment = appointment.appointment_name
          account.save
          render json: true, status: :created
        else
          render json: { error: appointment.errors.messages }, status: 422
        end
      else
        render json: false, status: :reserved
      end
    end

    def appointments
      appointments = DemoAppointment.all.order('id')
      appointment_to_accounts = {}

      appointments.each do |appointment|
        account = DemoAccount.find_by(id: appointment.account_id)
        appointment_to_accounts[appointment.id] = account
      end

      render json: { appointments:, appointment_to_accounts: }, status: :ok
    end

    def update_appointment
      appointment = DemoAppointment.find_by(id: params[:id])

      if appointment.nil?
        render json: false, status: 422
      else
        old_account = DemoAccount.find_by(id: appointment.account_id)
        old_account['appointment'] = nil
        old_account.save
        appointment['account_id'] = params[:account_id]
        appointment.save
        new_account = DemoAccount.find_by(id: appointment.account_id)
        new_account['appointment'] = appointment.appointment_name
        new_account.save
        render json: true, status: :ok
      end
    end

    def delete_appointment
      appointment = DemoAppointment.find_by(id: params[:id])
      account = DemoAccount.find_by(id: appointment.account_id)
      account['appointment'] = nil
      account.save

      if appointment.destroy
        render json: true, status: :ok
      else
        render json: false, status: 422
      end
    end
  end
end
