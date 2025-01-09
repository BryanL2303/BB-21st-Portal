# frozen_string_literal: true

class DemoParadeAttendance < ApplicationRecord
  belongs_to :demo_parade
  belongs_to :demo_account
end
