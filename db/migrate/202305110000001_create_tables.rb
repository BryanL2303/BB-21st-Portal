class CreateTables < ActiveRecord::Migration[7.0]
  def change
    create_table :accounts do |t|
      t.string :name
      t.string :password
      t.string :type

      t.timestamps
    end

    create_table :topics do |t|
      t.string :name

      t.timestamps
    end

    create_table :quizzes do |t|
      t.belongs_to :topic

      t.timestamps
    end

    create_table :quiz_questions do |t|
      t.belongs_to :quiz
      t.belongs_to :question

      t.timestamps
    end

    create_table :questions do |t|
      t.belongs_to :topic
      t.string :type
      t.string :question
      t.integer :marks

      t.timestamps
    end

    create_table :question_options do |t|
      t.belongs_to :question
      t.string :answer
      t.boolean :correct

      t.timestamps
    end

    create_table :answer_rubric do |t|
      t.belongs_to :question
      t.string :rubric

      t.timestamps
    end
  end
end
