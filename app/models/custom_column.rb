# frozen_string_literal: true

class CustomColumn < ApplicationRecord
  belongs_to :award, optional: true
  belongs_to :mastery, optional: true
end
