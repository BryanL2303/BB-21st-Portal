class RenameColumn2 < ActiveRecord::Migration[7.0]
  def change
    change_table :questions do |t|
      t.remove :type
      t.string :question_type
    end
  end
end