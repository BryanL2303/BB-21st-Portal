# frozen_string_literal: true

class Appointment < ApplicationRecord
  belongs_to :account
end
