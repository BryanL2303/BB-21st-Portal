# frozen_string_literal: true

class AddToAccountsTable < ActiveRecord::Migration[7.0]
    def change
      change_table :demo_accounts do |t|
        t.string :honorifics
        t.string :abbreviated_name
        t.string :user_name
      end
    end
end