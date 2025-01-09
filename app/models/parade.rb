# frozen_string_literal: true

class DemoParade < ApplicationRecord
  has_many :demo_parade_announcements
  has_many :demo_parade_platoon_announcements
  has_many :demo_parade_platoon_programs
end
