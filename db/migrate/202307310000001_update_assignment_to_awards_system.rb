class UpdateAssignmentToAwardsSystem < ActiveRecord::Migration[7.0]
  def change
    change_table :assignments do |t|
      t.remove :topic_name
      t.belongs_to :award
      t.belongs_to :mastery
    end
  end
end
