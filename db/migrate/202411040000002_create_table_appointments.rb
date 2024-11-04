# frozen_string_literal: true

class CreateTableAppointments < ActiveRecord::Migration[7.0]
    def change
      create_table :appointments do |t|
        t.string :appointment_name
        t.string :account_type
        t.belongs_to :account
  
        t.timestamps
      end
    end
end