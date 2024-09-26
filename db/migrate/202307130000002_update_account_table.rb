class UpdateAccountTable < ActiveRecord::Migration[7.0]
  def change
    change_table :accounts do |t|
      t.string :rank
    end
  end
end
