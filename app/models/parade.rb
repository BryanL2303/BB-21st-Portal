# frozen_string_literal: true

class Parade < ApplicationRecord
    has_many :parade_announcements
    has_many :parade_platoon_announcements
    has_many :parade_platoon_programs
end
