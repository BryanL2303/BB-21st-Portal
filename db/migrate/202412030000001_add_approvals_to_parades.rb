# frozen_string_literal: true

class AddApprovalsToParades < ActiveRecord::Migration[7.0]
    def change
      change_table :demo_parades do |t|
        t.boolean :cos_finalized
        t.boolean :csm_finalized
        t.boolean :do_finalized
        t.boolean :captain_finalized
      end
    end
end