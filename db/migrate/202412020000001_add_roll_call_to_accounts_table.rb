# frozen_string_literal: true

class AddRollCallToAccountsTable < ActiveRecord::Migration[7.0]
    def change
      change_table :demo_accounts do |t|
        t.boolean :roll_call
      end
    end
end