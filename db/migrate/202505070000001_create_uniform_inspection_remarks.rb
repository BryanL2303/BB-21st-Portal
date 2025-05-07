class CreateUniformInspectionRemarks < ActiveRecord::Migration[7.0]
  def change
    create_table :uniform_inspection_remarks do |t|
      t.integer :inspection_id
      t.integer :component_id
      t.text :remarks
      t.timestamps
    end
  end
end
