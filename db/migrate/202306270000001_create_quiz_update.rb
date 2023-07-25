class CreateQuizUpdate < ActiveRecord::Migration[7.0]
  def change
    change_table :questions do |t|
      t.boolean :permanent
    end

    change_table :quizzes do |t|
      t.integer :marks
    end
  end
end