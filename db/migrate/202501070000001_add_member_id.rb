# frozen_string_literal: true

class AddMemberId < ActiveRecord::Migration[7.0]
    def change
      change_table :demo_accounts do |t|
        t.string :member_id
      end
    end
end