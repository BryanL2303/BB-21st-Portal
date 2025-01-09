# frozen_string_literal: true

class CreateParadesTable < ActiveRecord::Migration[7.0]
    def change
      create_table :demo_parades do |t|
        t.string :parade_type
        t.datetime :date
        t.string :venue
        t.string :sec_1_attire
        t.string :sec_2_attire
        t.string :sec_3_attire
        t.string :sec_4_5_attire
        t.datetime :reporting_time
        t.datetime :dismissal_time
        t.integer :dt_id
        t.integer :do_id
        t.integer :cos_id
        t.integer :flag_bearer_id
        t.integer :csm_id
        t.integer :ce_id
        t.text :description
  
        t.timestamps
      end

      create_table :demo_parade_company_announcements do |t|
        t.belongs_to :demo_parade
        t.text :announcement
  
        t.timestamps
      end

      create_table :demo_parade_platoon_programs do |t|
        t.belongs_to :demo_parade
        t.string :level
        t.string :program
        t.datetime :start_time
        t.datetime :end_time
  
        t.timestamps
      end

      create_table :demo_parade_platoon_announcements do |t|
        t.belongs_to :demo_parade
        t.string :level
        t.text :announcement
  
        t.timestamps
      end

      create_table :demo_parade_attendances do |t|
        t.belongs_to :demo_parade
        t.belongs_to :demo_account
        t.string :attendance
      end
    end
end