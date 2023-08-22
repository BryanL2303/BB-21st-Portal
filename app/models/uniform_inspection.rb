class UniformInspection < ApplicationRecord
	has_many :selected_components
	belongs_to :account
end