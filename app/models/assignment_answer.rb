# frozen_string_literal: true

class AssignmentAnswer < ApplicationRecord
  belongs_to :account
  belongs_to :assignment
  belongs_to :question
  belongs_to :question_option, optional: true
end
