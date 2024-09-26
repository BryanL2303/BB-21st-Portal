class AssignedAccount < ApplicationRecord
  belongs_to :assignment
  belongs_to :account
end
