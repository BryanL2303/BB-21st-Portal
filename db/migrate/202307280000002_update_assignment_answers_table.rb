class UpdateAssignmentAnswersTable < ActiveRecord::Migration[7.0]
  def change
    change_table :assignment_answers do |t|
      t.integer :attempt
    end
  end
end