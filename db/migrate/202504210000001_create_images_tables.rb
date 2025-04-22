class CreateImagesTables < ActiveRecord::Migration[7.0]
  def change
    create_table :home_images do |t|
      t.binary :image
      t.timestamps
      t.integer :order
    end
  end 
end
