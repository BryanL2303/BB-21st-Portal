# frozen_string_literal: true

class DemoAttainedAward < ApplicationRecord
  belongs_to :demo_account
  belongs_to :demo_award
  belongs_to :demo_mastery, optional: true
end
