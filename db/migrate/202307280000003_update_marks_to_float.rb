class UpdateMarksToFloat < ActiveRecord::Migration[7.0]
  def change
    change_table :questions do |t|
      t.remove :marks
      t.float :marks
    end

    change_table :quizzes do |t|
      t.remove :marks
      t.float :marks
    end

    change_table :assigned_accounts do |t|
      t.remove :score
      t.float :score
    end

    change_table :assignment_answers do |t|
      t.remove :score
      t.float :score
    end
  end
end
