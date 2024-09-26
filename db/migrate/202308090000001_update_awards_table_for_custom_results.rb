class UpdateAwardsTableForCustomResults < ActiveRecord::Migration[7.0]
  def change
    change_table :awards do |t|
      t.boolean :custom_description
      t.boolean :custom_columns
      t.remove :require_certification
    end

    change_table :masteries do |t|
      t.boolean :custom_description
      t.boolean :custom_columns
      t.remove :require_certification
    end

    create_table :custom_columns do |t|
      t.belongs_to :awards
      t.belongs_to :masteries
      t.string :column_title

      t.timestamps
    end
  end
end
