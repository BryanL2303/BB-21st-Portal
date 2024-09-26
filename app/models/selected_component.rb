# frozen_string_literal: true

class SelectedComponent < ApplicationRecord
  belongs_to :uniform_inspection
  belongs_to :component_field
end
