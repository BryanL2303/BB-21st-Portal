# frozen_string_literal: true

class ParadeAttendance < ApplicationRecord
    belongs_to :parade
    belongs_to :account
end
