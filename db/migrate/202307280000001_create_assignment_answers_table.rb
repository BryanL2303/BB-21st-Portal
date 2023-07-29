class CreateAssignmentAnswersTable < ActiveRecord::Migration[7.0]
  def change
    create_table :assignment_answers do |t|
      t.belongs_to :account
      t.belongs_to :assignment
      t.belongs_to :question
      t.belongs_to :question_option
      t.string :question_type
      t.string :answer
      t.integer :score

      t.timestamps
    end
  end
end