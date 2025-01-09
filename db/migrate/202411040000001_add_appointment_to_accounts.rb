# frozen_string_literal: true

class AddAppointmentToAccounts < ActiveRecord::Migration[7.0]
    def change
      change_table :demo_accounts do |t|
        t.string :appointment
      end
    end
  end