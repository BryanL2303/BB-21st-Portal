# frozen_string_literal: true

module Api
    # The ParadeController is responsible for handling parade related actions
    # within the API, such as CRUD functions for parades and filtered get functions.
    #
    # This controller should include functions that relates to the tables Parade,
    # ParadeCompanyAnnouncement, ParadePlatoonProgram and ParadePlatoonAnnouncement
    class ParadeController < ApplicationController
      protect_from_forgery with: :null_session
      before_action :authenticate_request
  
      def create_parade
        parade = Parade.new(parade_type: params[:parade_type], date: DateTime.parse(params[:date]),
         venue: params[:venue], sec_1_attire: params[:sec_1_attire], sec_2_attire: params[:sec_2_attire],
         sec_3_attire: params[:sec_3_attire], sec_4_5_attire: params[:sec_4_5_attire],
         reporting_time: DateTime.parse(params[:reporting_time]),
         dismissal_time: DateTime.parse(params[:dismissal_time]), dt_id: params[:dt_id], do_id: params[:do_id],
         cos_id: params[:cos_id], flag_bearer_id: params[:flag_bearer_id], csm_id: params[:csm_id],
         ce_id: params[:ce_id], description: params[:description])
        find_parade = Parade.find_by(date: params[:date])
  
        if find_parade.nil?
          if parade.save
            params[:company_announcements].each do |company_announcement|
              announcement = ParadeCompanyAnnouncement.new(parade_id: parade.id, announcement: company_announcement['announcement'])
              announcement.save
            end
  
            ['1', '2', '3', '4/5'].each do |level|
              params[:platoon_programs][level].each do |platoon_program|
                program = ParadePlatoonProgram.new(parade_id: parade.id, level: level, start_time: DateTime.parse(platoon_program['start_time']),
                 end_time: DateTime.parse(platoon_program['end_time']), program: platoon_program['program'])
                program.save
              end
            end
  
            ['1', '2', '3', '4/5'].each do |level|
              params[:platoon_announcements][level].each do |platoon_announncement|
                announcement = ParadePlatoonAnnouncement.new(parade_id: parade.id, level: level, announcement: platoon_announcement['announcement'])
                announcement.save
              end
            end

            render json: true, status: :created
          else
            render json: { error: parade.errors.messages }, status: 422
          end
        else
          render json: false, status: :reserved
        end
      end
  
      # This should be modified to also include all the programs and announcements
      def parade
        data = {}
        data["info"] = Parade.find_by(id: params[:id])
        data["platoon_announcements"] = {}
        data["platoon_programs"] = {}
        data["parade_attendance"] = {}

        data["company_announcements"] = ParadeCompanyAnnouncement.where(parade_id: params[:id])
        data["platoon_announcements"]['1'] = ParadePlatoonAnnouncement.where(parade_id: params[:id], level: '1')
        data["platoon_announcements"]['2'] = ParadePlatoonAnnouncement.where(parade_id: params[:id], level: '2')
        data["platoon_announcements"]['3'] = ParadePlatoonAnnouncement.where(parade_id: params[:id], level: '3')
        data["platoon_announcements"]['4/5'] = ParadePlatoonAnnouncement.where(parade_id: params[:id], level: '4/5')
        data["platoon_programs"]['1'] = ParadePlatoonProgram.where(parade_id: params[:id], level: '1').order('start_time')
        data["platoon_programs"]['2'] = ParadePlatoonProgram.where(parade_id: params[:id], level: '2').order('start_time')
        data["platoon_programs"]['3'] = ParadePlatoonProgram.where(parade_id: params[:id], level: '3').order('start_time')
        data["platoon_programs"]['4/5'] = ParadePlatoonProgram.where(parade_id: params[:id], level: '4/5').order('start_time')
        attendances = ParadeAttendance.where(parade_id: params[:id])
        attendances.each do |attendance|
          data["parade_attendance"][attendance.account_id] = attendance
        end

        if !data["info"].dt_id.nil?
          data["dt"] = Account.find_by(id: data["info"].dt_id)
        end

        if !data["info"].do_id.nil?
          data["do"] = Account.find_by(id: data["info"].do_id)
        end

        if !data["info"].csm_id.nil?
          data["csm"] = Account.find_by(id: data["info"].csm_id)
        end

        if !data["info"].cos_id.nil?
          data["cos"] = Account.find_by(id: data["info"].cos_id)
        end

        if !data["info"].flag_bearer_id.nil?
          data["flag_bearer"] = Account.find_by(id: data["info"].flag_bearer_id)
        end

        if !data["info"].ce_id.nil?
          data["ce"] = Account.find_by(id: data["info"].ce_id)
        end
  
        render json: data, status: :ok
      end
  
      def parades_by_year
        data = {}
        data["parades"] = Parade.where("EXTRACT(YEAR FROM date) = ?", params[:year]).order('date')
        data["parade_attendance"] = {}

        data["parades"].each do |parade|
          data["parade_attendance"][parade.id] = {}
          parade_attendances = ParadeAttendance.where(parade_id: parade.id).order('account_id')
          parade_attendances.each do |attendance|
            data["parade_attendance"][parade.id][attendance.account_id] = attendance.attendance
          end
        end
  
        render json: data, status: :ok
      end
  
      def edit_parade
        parade = Parade.find_by(id: params[:id])
  
        date_clash = Parade.find_by(date: params[:date])
        if date_clash.nil? || date_clash['id'] == parade.id
          parade.parade_type = params[:parade_type]
          parade.date = params[:date]
          parade.venue = params[:venue]
          parade.sec_1_attire = params[:sec_1_attire]
          parade.sec_2_attire = params[:sec_2_attire]
          parade.sec_3_attire = params[:sec_3_attire]
          parade.sec_4_5_attire = params[:sec_4_5_attire]
          parade.reporting_time = params[:reporting_time]
          parade.dismissal_time = params[:dismissal_time]
          parade.dt_id = params[:dt_id]
          parade.do_id = params[:do_id]
          parade.cos_id = params[:cos_id]
          parade.flag_bearer_id = params[:flag_bearer_id]
          parade.csm_id = params[:csm_id]
          parade.ce_id = params[:ce_id]
          parade.description = params[:description]
          parade.save

          ParadeCompanyAnnouncement.where(parade_id: params[:id]).destroy_all
          params[:company_announcements].each do |company_announcement|
            announcement = ParadeCompanyAnnouncement.new(parade_id: params[:id], announcement: company_announcement['announcement'])
            announcement.save
          end

          ParadePlatoonProgram.where(parade_id: params[:id]).destroy_all
          ['1', '2', '3', '4/5'].each do |level|
            params[:platoon_programs][level].each do |platoon_program|
              program = ParadePlatoonProgram.new(parade_id: params[:id], level: level, start_time: DateTime.parse(platoon_program['start_time']),
               end_time: DateTime.parse(platoon_program['end_time']), program: platoon_program['program'])
              program.save
            end
          end

          ParadePlatoonAnnouncement.where(parade_id: params[:id]).destroy_all
          ['1', '2', '3', '4/5'].each do |level|
            params[:platoon_announcements][level].each do |platoon_announncement|
              announcement = ParadePlatoonAnnouncement.new(parade_id: params[:id], level: level, announcement: platoon_announcement['announcement'])
              announcement.save
            end
          end

          render json: true, status: :accepted
        else
          render json: false, status: :reserved
        end
      end

      def update_attendance
        parade_attendance = {}
        attendance = ParadeAttendance.find_or_initialize_by(parade_id: params[:id], account_id: params[:account_id])

        parade = Parade.find_by(id: params[:id])

        if (params[:parade_appointment] == 'cos' && (parade.csm_finalized || parade.do_finalized || parade.captain_finalized)) ||
          (params[:parade_appointment] == 'csm' && (parade.do_finalized || parade.captain_finalized)) ||
          (params[:parade_appointment] == 'do' && parade.captain_finalized)
          status = :permanent_redirect
        else
          if attendance.new_record? || attendance.attendance == params[:old_attendance] || attendance.attendance == params[:new_attendance]
            if params[:new_attendance] == nil
              attendance.destroy
            else
              attendance.attendance = params[:new_attendance]
              attendance.save
            end
            
            status = :ok
          else
            status = :not_modified
          end
        end
      
        ParadeAttendance.where(parade_id: params[:id]).each do |attendance|
          parade_attendance[attendance.account_id] = attendance
        end
      
        render json: parade_attendance, status: status
      end

      def update_finalize
        parade = Parade.find_by(id: params[:id])
        if params[:parade_appointment] == 'cos'
          parade.cos_finalized = params[:finalized]
        end
        if params[:parade_appointment] == 'csm'
          parade.csm_finalized = params[:finalized]
        end
        if params[:parade_appointment] == 'do'
          parade.do_finalized = params[:finalized]
        end
        if params[:parade_appointment] == 'captain'
          parade.captain_finalized = params[:finalized]
        end
        parade.save
      end
  
      def delete_parade
        parade = Parade.find_by(id: params[:id])

        ParadeCompanyAnnouncement.where(parade_id: parade.id).destroy_all
        ParadePlatoonProgram.where(parade_id: parade.id).destroy_all
        ParadePlatoonAnnouncement.where(parade_id: parade.id).destroy_all
        ParadeAttendance.where(parade_id: parade.id).destroy_all
  
        if parade.destroy
          head :no_content
        else
          render json: { error: parade.errors.messages }, status: 422
        end
      end
    end
  end
  