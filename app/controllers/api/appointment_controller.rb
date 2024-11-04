# frozen_string_literal: true

module Api
    # The AppointmentController is responsible for handling appointment related actions
    # within the API, such as CRUD functions for appointments.
    #
    # This controller should include functions that relates to the table Appointment
    class AppointmentController < ApplicationController
      protect_from_forgery with: :null_session
      before_action :authenticate_request

      def create_appointment
        appointment = Appointment.new(appointment_name: params[:appointment_name], account_id: params[:account_id],
                              account_type: params[:account_type])
        find_appointment = Appointment.find_by(appointment_name: params[:appointment_name])
  
        if find_appointment.nil?
          if appointment.save
            account = Account.find_by(id: appointment.account_id)
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
        appointments = Appointment.all.order('id')
        appointmentToAccounts = {}

        appointments.each do |appointment|
            account = Account.find_by(id: appointment.account_id)
            appointmentToAccounts[appointment.id] = account
        end
  
        render json: {appointments: appointments, appointmentToAccounts: appointmentToAccounts}, status: :ok
      end

      def update_appointment
        appointment = Appointment.find_by(id: params[:id])
  
        if appointment.nil?
          render json: false, status: 422
        else
            oldAccount = Account.find_by(id: appointment.account_id)
            oldAccount['appointment'] = nil
            oldAccount.save
            appointment['account_id'] = params[:account_id]
            appointment.save
            newAccount = Account.find_by(id: appointment.account_id)
            newAccount['appointment'] = appointment.appointment_name
            newAccount.save
            render json: true, status: :ok
        end
      end

      def delete_appointment
        appointment = Appointment.find_by(id: params[:id])
        account = Account.find_by(id: appointment.account_id)
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