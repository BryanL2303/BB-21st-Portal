class RenameColumns < ActiveRecord::Migration[7.0]
  def change
    change_table :accounts do |t|
      t.remove :name
      t.string :account_name
    end

    change_table :topics do |t|
      t.remove :name
      t.string :topic_name
    end

    change_table :quizzes do |t|
      t.string :quiz_name
    end

    drop_table :answer_rubric

    create_table :answer_rubrics do |t|
      t.belongs_to :question
      t.string :rubric

      t.timestamps
    end
  end
end