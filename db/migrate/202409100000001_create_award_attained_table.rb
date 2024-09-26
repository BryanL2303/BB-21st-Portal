class CreateAwardAttainedTable < ActiveRecord::Migration[7.0]
  def change
    create_table :attained_awards do |t|
      t.belongs_to :account
      t.belongs_to :award
      t.belongs_to :mastery

      t.timestamps
    end
  end
end
