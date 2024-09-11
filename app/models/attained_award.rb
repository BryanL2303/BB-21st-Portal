class AttainedAward < ApplicationRecord
	belongs_to :account
    belongs_to :award
    belongs_to :mastery, optional: true
end