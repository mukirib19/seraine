export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'staff' | 'logistics' | 'delivery_agent' | 'customer'
export type AccountType = 'individual' | 'business'
export type OrderStatus = 'pending' | 'confirmed' | 'in_production' | 'quality_check' | 'ready' | 'dispatched' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentMethod = 'mpesa_stk' | 'mpesa_manual' | 'card' | 'cash' | 'bank'
export type PaymentStatus = 'pending' | 'processing' | 'confirmed' | 'failed' | 'refunded'
export type DeliveryStatus = 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed' | 'reassigned'
export type ProductionStatus = 'queued' | 'in_production' | 'quality_check' | 'ready'
export type ProofStatus = 'pending_review' | 'approved' | 'revision_requested'
export type QuotationStatus = 'pending' | 'reviewing' | 'quoted' | 'accepted' | 'declined' | 'expired'
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'hidden'
export type VariantType = 'size' | 'colour' | 'material' | 'finish'
export type InventoryCategory = 'raw_material' | 'finished_stock' | 'consumable'
export type DeliveryType = 'delivery' | 'pickup'
export type Priority = 'low' | 'normal' | 'high' | 'urgent'

export interface Database {
  public: {
    Tables: {
      platform_config: {
        Row: {
          id: string
          setup_complete: boolean
          business_name: string | null
          tagline: string | null
          logo_url: string | null
          contact_email: string | null
          contact_phone: string | null
          address: string | null
          city: string | null
          country: string | null
          instagram_handle: string | null
          linkedin_url: string | null
          facebook_url: string | null
          whatsapp_number: string | null
          mpesa_till_number: string | null
          mpesa_business_name: string | null
          mpesa_paybill: string | null
          intasend_public_key: string | null
          intasend_secret_key: string | null
          intasend_environment: 'test' | 'live'
          flutterwave_public_key: string | null
          flutterwave_secret_key: string | null
          flutterwave_environment: 'test' | 'live'
          whatsapp_api_number: string | null
          whatsapp_api_token: string | null
          resend_api_key: string | null
          sender_email: string | null
          sender_display_name: string | null
          accent_color: string | null
          hero_headline: string | null
          hero_subtext: string | null
          announcement_active: boolean | null
          announcement_text: string | null
          announcement_url: string | null
          maintenance_mode: boolean | null
          google_analytics_id: string | null
          gsc_verification_code: string | null
          facebook_pixel_id: string | null
          session_timeout_minutes: number | null
          login_lockout_threshold: number | null
          reset_link_expiry_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['platform_config']['Row']>
        Update: Partial<Database['public']['Tables']['platform_config']['Row']>
      }
      profiles: {
        Row: {
          id: string
          role: UserRole
          display_id: string | null
          full_name: string
          phone: string | null
          avatar_url: string | null
          account_type: AccountType | null
          business_name: string | null
          is_active: boolean
          deactivated_at: string | null
          deactivated_by: string | null
          deactivation_reason: string | null
          email_verified: boolean | null
          two_fa_enabled: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          role?: UserRole
          phone?: string | null
          avatar_url?: string | null
          account_type?: AccountType | null
          business_name?: string | null
        }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      invite_tokens: {
        Row: {
          id: string
          token: string
          email: string
          role: 'staff' | 'logistics' | 'delivery_agent'
          invited_by: string
          used: boolean
          used_by: string | null
          expires_at: string
          created_at: string
        }
        Insert: {
          email: string
          role: 'staff' | 'logistics' | 'delivery_agent'
          invited_by: string
        }
        Update: Partial<Database['public']['Tables']['invite_tokens']['Row']>
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          user_display_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          old_value: Json | null
          new_value: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          action: string
          resource_type: string
          user_id?: string | null
          user_display_id?: string | null
          resource_id?: string | null
          old_value?: Json | null
          new_value?: Json | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: never
      }
      business_hours: {
        Row: {
          id: string
          day_of_week: number
          is_open: boolean
          open_time: string | null
          close_time: string | null
          updated_by: string | null
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['business_hours']['Row']>
        Update: Partial<Database['public']['Tables']['business_hours']['Row']>
      }
      business_exceptions: {
        Row: {
          id: string
          exception_date: string
          is_closed: boolean
          custom_message: string | null
          open_time: string | null
          close_time: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          exception_date: string
          is_closed?: boolean
          custom_message?: string | null
          open_time?: string | null
          close_time?: string | null
        }
        Update: Partial<Database['public']['Tables']['business_exceptions']['Row']>
      }
      product_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon_name: string | null
          display_order: number | null
          is_active: boolean | null
          created_at: string
        }
        Insert: {
          name: string
          slug: string
          description?: string | null
          icon_name?: string | null
          display_order?: number | null
        }
        Update: Partial<Database['public']['Tables']['product_categories']['Row']>
      }
      products: {
        Row: {
          id: string
          category_id: string
          name: string
          slug: string
          sku: string | null
          short_description: string | null
          long_description: string | null
          base_price: number
          currency: string
          stock_quantity: number
          low_stock_threshold: number
          is_published: boolean
          is_available: boolean
          is_custom_order: boolean
          lead_time_days: number | null
          scheduled_publish_at: string | null
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          category_id: string
          name: string
          slug: string
          base_price: number
          short_description?: string | null
          long_description?: string | null
          stock_quantity?: number
          low_stock_threshold?: number
          is_published?: boolean
          is_available?: boolean
          is_custom_order?: boolean
          lead_time_days?: number | null
        }
        Update: Partial<Database['public']['Tables']['products']['Row']>
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          storage_path: string
          public_url: string
          display_order: number
          is_thumbnail: boolean
          alt_text: string | null
          created_at: string
        }
        Insert: {
          product_id: string
          storage_path: string
          public_url: string
          display_order?: number
          is_thumbnail?: boolean
          alt_text?: string | null
        }
        Update: Partial<Database['public']['Tables']['product_images']['Row']>
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          variant_type: VariantType
          value: string
          additional_price: number | null
          is_available: boolean | null
          display_order: number | null
        }
        Insert: {
          product_id: string
          variant_type: VariantType
          value: string
          additional_price?: number | null
        }
        Update: Partial<Database['public']['Tables']['product_variants']['Row']>
      }
      product_specs: {
        Row: {
          id: string
          product_id: string
          spec_name: string
          spec_value: string
          display_order: number | null
        }
        Insert: {
          product_id: string
          spec_name: string
          spec_value: string
          display_order?: number | null
        }
        Update: Partial<Database['public']['Tables']['product_specs']['Row']>
      }
      bulk_pricing_tiers: {
        Row: {
          id: string
          product_id: string
          min_quantity: number
          max_quantity: number | null
          price_per_unit: number
          display_order: number | null
        }
        Insert: {
          product_id: string
          min_quantity: number
          price_per_unit: number
          max_quantity?: number | null
        }
        Update: Partial<Database['public']['Tables']['bulk_pricing_tiers']['Row']>
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          product_id: string
        }
        Update: never
      }
      customer_addresses: {
        Row: {
          id: string
          user_id: string
          label: 'Home' | 'Office' | 'Other'
          full_name: string
          phone: string | null
          address_line1: string
          address_line2: string | null
          city: string
          county: string | null
          country: string
          is_default: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          full_name: string
          address_line1: string
          city: string
          label?: 'Home' | 'Office' | 'Other'
          phone?: string | null
          address_line2?: string | null
          county?: string | null
          is_default?: boolean
        }
        Update: Partial<Database['public']['Tables']['customer_addresses']['Row']>
      }
      delivery_zones: {
        Row: {
          id: string
          name: string
          description: string | null
          fee: number
          fee_model: 'flat' | 'per_km' | 'per_zone'
          is_active: boolean | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          fee: number
          fee_model?: 'flat' | 'per_km' | 'per_zone'
          description?: string | null
        }
        Update: Partial<Database['public']['Tables']['delivery_zones']['Row']>
      }
      quotations: {
        Row: {
          id: string
          display_id: string | null
          user_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string | null
          service_type: string
          brief: string
          reference_files: Json | null
          status: QuotationStatus
          quoted_amount: number | null
          quote_notes: string | null
          quote_sent_at: string | null
          accepted_at: string | null
          converted_order_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          customer_name: string
          customer_email: string
          service_type: string
          brief: string
          customer_phone?: string | null
          reference_files?: Json | null
        }
        Update: Partial<Database['public']['Tables']['quotations']['Row']>
      }
      quotation_items: {
        Row: {
          id: string
          quotation_id: string
          description: string
          quantity: number
          unit_price: number
          total_price: number
        }
        Insert: {
          quotation_id: string
          description: string
          quantity?: number
          unit_price: number
        }
        Update: Partial<Database['public']['Tables']['quotation_items']['Row']>
      }
      orders: {
        Row: {
          id: string
          display_id: string | null
          user_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string | null
          delivery_zone_id: string | null
          delivery_address_id: string | null
          delivery_address_snapshot: Json | null
          delivery_type: DeliveryType
          delivery_fee: number | null
          subtotal: number
          total_amount: number
          currency: string
          status: OrderStatus
          from_quotation_id: string | null
          assigned_staff_id: string | null
          special_instructions: string | null
          is_guest_order: boolean | null
          edit_enabled: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          customer_name: string
          customer_email: string
          subtotal: number
          total_amount: number
          user_id?: string | null
          customer_phone?: string | null
          delivery_type?: DeliveryType
          delivery_fee?: number | null
          special_instructions?: string | null
        }
        Update: Partial<Database['public']['Tables']['orders']['Row']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_sku: string | null
          category_name: string | null
          quantity: number
          unit_price: number
          total_price: number
          variant_selections: Json | null
          created_at: string
        }
        Insert: {
          order_id: string
          product_name: string
          quantity: number
          unit_price: number
          product_id?: string | null
          product_sku?: string | null
          category_name?: string | null
          variant_selections?: Json | null
        }
        Update: Partial<Database['public']['Tables']['order_items']['Row']>
      }
      order_specs: {
        Row: {
          id: string
          order_id: string
          order_item_id: string | null
          spec_key: string
          spec_value: string
          created_at: string
        }
        Insert: {
          order_id: string
          spec_key: string
          spec_value: string
          order_item_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['order_specs']['Row']>
      }
      order_files: {
        Row: {
          id: string
          order_id: string
          order_item_id: string | null
          file_name: string
          storage_path: string
          file_type: string | null
          file_size_bytes: number | null
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          order_id: string
          file_name: string
          storage_path: string
          file_type?: string | null
          file_size_bytes?: number | null
          uploaded_by?: string | null
        }
        Update: Partial<Database['public']['Tables']['order_files']['Row']>
      }
      order_notes: {
        Row: {
          id: string
          order_id: string
          author_id: string | null
          note: string
          is_internal: boolean
          created_at: string
        }
        Insert: {
          order_id: string
          note: string
          is_internal?: boolean
          author_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['order_notes']['Row']>
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string
          changed_by: string | null
          old_status: string | null
          new_status: string
          note: string | null
          created_at: string
        }
        Insert: {
          order_id: string
          new_status: string
          changed_by?: string | null
          old_status?: string | null
          note?: string | null
        }
        Update: never
      }
      production_queue: {
        Row: {
          id: string
          order_id: string
          status: ProductionStatus
          priority: Priority
          assigned_staff_id: string | null
          due_date: string | null
          position: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          order_id: string
          status?: ProductionStatus
          priority?: Priority
          assigned_staff_id?: string | null
          due_date?: string | null
          position?: number | null
          notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['production_queue']['Row']>
      }
      design_proofs: {
        Row: {
          id: string
          order_id: string
          order_item_id: string | null
          status: ProofStatus
          max_revisions: number
          revisions_used: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          order_id: string
          order_item_id?: string | null
          max_revisions?: number
          created_by?: string | null
        }
        Update: Partial<Database['public']['Tables']['design_proofs']['Row']>
      }
      proof_revisions: {
        Row: {
          id: string
          proof_id: string
          version_number: number
          storage_path: string
          public_url: string
          uploaded_by: string | null
          customer_action: 'approved' | 'revision_requested' | null
          customer_notes: string | null
          action_at: string | null
          created_at: string
        }
        Insert: {
          proof_id: string
          version_number: number
          storage_path: string
          public_url: string
          uploaded_by?: string | null
        }
        Update: Partial<Database['public']['Tables']['proof_revisions']['Row']>
      }
      payments: {
        Row: {
          id: string
          display_id: string | null
          order_id: string
          user_id: string | null
          amount: number
          currency: string
          method: PaymentMethod
          status: PaymentStatus
          mpesa_checkout_request_id: string | null
          mpesa_merchant_request_id: string | null
          mpesa_transaction_code: string | null
          mpesa_message_raw: string | null
          mpesa_sender_name: string | null
          mpesa_sender_phone: string | null
          mpesa_timestamp: string | null
          manual_verification_status: 'pending' | 'verified' | 'rejected' | null
          manual_verified_by: string | null
          manual_verified_at: string | null
          gateway_reference: string | null
          gateway_response: Json | null
          confirmed_at: string | null
          failed_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          order_id: string
          amount: number
          method: PaymentMethod
          user_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['payments']['Row']>
      }
      receipts: {
        Row: {
          id: string
          display_id: string | null
          order_id: string
          payment_id: string | null
          user_id: string | null
          type: 'receipt' | 'invoice'
          storage_path: string | null
          public_url: string | null
          issued_at: string
          created_at: string
        }
        Insert: {
          order_id: string
          type: 'receipt' | 'invoice'
          payment_id?: string | null
          user_id?: string | null
          storage_path?: string | null
          public_url?: string | null
        }
        Update: Partial<Database['public']['Tables']['receipts']['Row']>
      }
      deliveries: {
        Row: {
          id: string
          display_id: string | null
          order_id: string
          agent_id: string | null
          assigned_by: string | null
          zone_id: string | null
          status: DeliveryStatus
          pickup_address: string | null
          delivery_address: Json
          customer_phone: string | null
          special_notes: string | null
          picked_up_at: string | null
          delivered_at: string | null
          failed_reason: string | null
          failed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          order_id: string
          delivery_address: Json
          agent_id?: string | null
          assigned_by?: string | null
          zone_id?: string | null
          customer_phone?: string | null
          special_notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['deliveries']['Row']>
      }
      delivery_status_history: {
        Row: {
          id: string
          delivery_id: string
          changed_by: string | null
          old_status: string | null
          new_status: string
          note: string | null
          created_at: string
        }
        Insert: {
          delivery_id: string
          new_status: string
          changed_by?: string | null
          old_status?: string | null
          note?: string | null
        }
        Update: never
      }
      attendance_logs: {
        Row: {
          id: string
          user_id: string
          user_display_id: string
          clock_in_at: string
          clock_out_at: string | null
          duration_minutes: number | null
          clock_out_note: string | null
          manually_corrected: boolean | null
          corrected_by: string | null
          correction_note: string | null
          date: string
          created_at: string
        }
        Insert: {
          user_id: string
          user_display_id: string
          clock_out_note?: string | null
        }
        Update: Partial<Database['public']['Tables']['attendance_logs']['Row']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          body: string
          is_read: boolean
          read_at: string | null
          action_url: string | null
          email_sent: boolean | null
          email_sent_at: string | null
          whatsapp_sent: boolean | null
          whatsapp_sent_at: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          type: string
          title: string
          body: string
          action_url?: string | null
        }
        Update: Partial<Database['public']['Tables']['notifications']['Row']>
      }
      notification_preferences: {
        Row: {
          id: string
          user_id: string
          order_updates_email: boolean | null
          order_updates_whatsapp: boolean | null
          order_updates_inapp: boolean | null
          delivery_updates_email: boolean | null
          delivery_updates_whatsapp: boolean | null
          proof_updates_email: boolean | null
          stock_alerts_inapp: boolean | null
          marketing_email: boolean | null
        }
        Insert: {
          user_id: string
        }
        Update: Partial<Database['public']['Tables']['notification_preferences']['Row']>
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          order_id: string | null
          rating: number
          title: string | null
          body: string | null
          status: ReviewStatus
          moderated_by: string | null
          moderated_at: string | null
          created_at: string
        }
        Insert: {
          product_id: string
          user_id: string
          rating: number
          title?: string | null
          body?: string | null
          order_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['reviews']['Row']>
      }
      inventory_items: {
        Row: {
          id: string
          name: string
          category: InventoryCategory
          unit: string
          current_stock: number
          low_stock_threshold: number
          sku: string | null
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          category: InventoryCategory
          unit?: string
          current_stock?: number
          low_stock_threshold?: number
        }
        Update: Partial<Database['public']['Tables']['inventory_items']['Row']>
      }
      inventory_transactions: {
        Row: {
          id: string
          item_id: string
          type: 'received' | 'used' | 'adjustment' | 'damaged' | 'returned'
          quantity_change: number
          quantity_before: number
          quantity_after: number
          reference_id: string | null
          notes: string | null
          recorded_by: string | null
          created_at: string
        }
        Insert: {
          item_id: string
          type: 'received' | 'used' | 'adjustment' | 'damaged' | 'returned'
          quantity_change: number
          quantity_before: number
          quantity_after: number
          reference_id?: string | null
          notes?: string | null
          recorded_by?: string | null
        }
        Update: never
      }
      portfolio_items: {
        Row: {
          id: string
          title: string
          category_id: string | null
          description: string | null
          storage_path: string
          public_url: string
          show_client: boolean | null
          client_name: string | null
          display_order: number | null
          is_published: boolean | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          title: string
          storage_path: string
          public_url: string
          category_id?: string | null
          description?: string | null
        }
        Update: Partial<Database['public']['Tables']['portfolio_items']['Row']>
      }
      design_services: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price_from: number | null
          currency: string
          turnaround_days: number | null
          features: Json | null
          is_active: boolean | null
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          slug: string
          description?: string | null
          price_from?: number | null
          turnaround_days?: number | null
          features?: Json | null
        }
        Update: Partial<Database['public']['Tables']['design_services']['Row']>
      }
      terms_versions: {
        Row: {
          id: string
          version_number: number
          content: string
          is_current: boolean
          published_by: string | null
          published_at: string | null
          created_at: string
        }
        Insert: {
          version_number: number
          content: string
          is_current?: boolean
          published_by?: string | null
        }
        Update: Partial<Database['public']['Tables']['terms_versions']['Row']>
      }
      privacy_versions: {
        Row: {
          id: string
          version_number: number
          content: string
          is_current: boolean
          published_by: string | null
          published_at: string | null
          created_at: string
        }
        Insert: {
          version_number: number
          content: string
          is_current?: boolean
          published_by?: string | null
        }
        Update: Partial<Database['public']['Tables']['privacy_versions']['Row']>
      }
      featured_products: {
        Row: {
          id: string
          product_id: string
          display_order: number | null
          added_by: string | null
          created_at: string
        }
        Insert: {
          product_id: string
          display_order?: number | null
          added_by?: string | null
        }
        Update: Partial<Database['public']['Tables']['featured_products']['Row']>
      }
    }
    Views: {
      v_daily_revenue: {
        Row: {
          day: string
          order_count: number
          total_revenue: number
          avg_order_value: number
        }
      }
      v_top_products: {
        Row: {
          product_id: string
          product_name: string
          category_name: string | null
          total_units: number
          total_revenue: number
          order_count: number
        }
      }
      v_agent_performance: {
        Row: {
          agent_id: string
          agent_name: string
          agent_display_id: string
          total_deliveries: number
          completed: number
          failed: number
          success_rate: number
        }
      }
      v_attendance_summary: {
        Row: {
          user_id: string
          user_display_id: string
          full_name: string
          week_start: string
          days_present: number
          total_minutes: number
          total_hours: number
        }
      }
      v_low_stock: {
        Row: {
          id: string
          name: string
          sku: string | null
          stock_quantity: number
          low_stock_threshold: number
          category_name: string
        }
      }
    }
    Functions: {
      get_my_role: { Args: Record<string, never>; Returns: string }
      is_admin: { Args: Record<string, never>; Returns: boolean }
      is_staff: { Args: Record<string, never>; Returns: boolean }
      is_logistics: { Args: Record<string, never>; Returns: boolean }
      is_delivery_agent: { Args: Record<string, never>; Returns: boolean }
      is_internal: { Args: Record<string, never>; Returns: boolean }
    }
  }
}
