class RenamePasswordToPasswordDigestInAccounts < ActiveRecord::Migration[7.0]
  def change
    rename_column :account, :password, :password_digest
  end
end
