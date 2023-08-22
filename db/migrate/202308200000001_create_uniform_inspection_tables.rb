class CreateUniformInspectionTables < ActiveRecord::Migration[7.0]
  def change
    create_table :uniform_components do |t|
      t.string :component_name
      t.integer :total_score

      t.timestamps
    end

    create_table :component_fields do |t|
      t.belongs_to :uniform_component
      t.string :description
      t.integer :score

      t.timestamps
    end

    create_table :uniform_inspections do |t|
      t.belongs_to :account
      t.integer :total_score
      t.string :date
      t.integer :assessor_id

      t.timestamps
    end

    create_table :selected_components do |t|
      t.belongs_to :uniform_inspection
      t.belongs_to :component_field

      t.timestamps
    end
  end
end