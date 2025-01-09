# frozen_string_literal: true

class CreateTableAppointments < ActiveRecord::Migration[7.0]
    def change
      create_table :demo_appointments do |t|
        t.string :appointment_name
        t.string :account_type
        t.belongs_to :demo_account
  
        t.timestamps
      end
    end
end