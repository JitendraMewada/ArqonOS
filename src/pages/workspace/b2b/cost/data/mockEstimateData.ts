import { ProjectMasterEstimate, VendorTradeRateCard, ProjectVendorAssignment } from './estimateTypes';

export const MOCK_VENDOR_RATE_CARDS: VendorTradeRateCard[] = [
  {
    vendorId: 'ven-civil-1',
    vendorName: 'Apex Civil Infra & Masonry',
    tradeCategory: 'Civil',
    tradeCode: 'A',
    rates: [
      { itemKey: 'demolition_flooring', description: 'Removing of old Flooring & Lowering the same', unit: 'Sq.ft.', standardRate: 8.0, preferredRate: 7.5 },
      { itemKey: 'demolition_skirting', description: 'Removing of old Skirting & Lowering the same', unit: 'Sq.ft.', standardRate: 8.0, preferredRate: 8.0 },
      { itemKey: 'demolition_brick_6in', description: 'Removing of old 6" Thick brick wall & Lowering', unit: 'Sq.ft.', standardRate: 8.0, preferredRate: 8.0 },
      { itemKey: 'demolition_brick_9in', description: 'Removing of old 9" Thick brick wall & Lowering', unit: 'Sq.ft.', standardRate: 10.0, preferredRate: 9.5 },
      { itemKey: 'demolition_wall_plaster', description: 'Removing of Old Wall Plaster', unit: 'Sq.ft.', standardRate: 8.0, preferredRate: 7.5 },
      { itemKey: 'door_frame_remove', description: 'Removing Of Door Frame', unit: 'R.ft.', standardRate: 25.0, preferredRate: 25.0 },
      { itemKey: 'floor_cleaning', description: 'Room Floor Cleaning & Surface Preparation', unit: 'Sq.ft.', standardRate: 8.0, preferredRate: 7.5 },
      { itemKey: 'cement_slurry', description: 'Chipping & Applying Cement Slurry on floor', unit: 'Sq.ft.', standardRate: 5.0, preferredRate: 5.0 },
      { itemKey: 'brick_masonry_115mm', description: 'Providing and Erecting 115mm thk Brick Masonry in 1:4 cement sand mortar with RCC stiffeners', unit: 'Sq.ft.', standardRate: 35.0, preferredRate: 35.0 },
      { itemKey: 'door_frame_fixing', description: 'Providing and fixing Main door Wooden frames to Line Level & Plumb', unit: 'No.', standardRate: 1000.0, preferredRate: 950.0 },
      { itemKey: 'double_coat_plaster_19mm', description: 'Providing and applying Wall Average 19mm thk Plaster in Double coat 1:4', unit: 'Sq.ft.', standardRate: 40.0, preferredRate: 38.0 },
      { itemKey: 'pcc_mortar_toilet', description: 'Providing and Making P.C.C. in cement mortar in sunk areas', unit: 'Sq.ft.', standardRate: 30.0, preferredRate: 30.0 },
      { itemKey: 'italian_marble_flooring', description: 'Providing and Laying Italian Marble (Avg 75mm bedding in 1:6 cement, matching grout)', unit: 'Sq.ft.', standardRate: 488.0, preferredRate: 475.0, specRemarks: 'Basic Italian Marble Rs.300/sq.ft. included' },
      { itemKey: 'marble_window_jamb', description: 'Providing Fixing Window Jamb with 1.5" thk Italian marble (up to 6" width)', unit: 'R.ft.', standardRate: 530.0, preferredRate: 510.0 },
      { itemKey: 'marble_skirting_3in', description: 'Italian marble 3" skirting with pencil edge polish', unit: 'R.ft.', standardRate: 200.0, preferredRate: 190.0 },
      { itemKey: 'marble_moulding_jamb', description: 'Providing & Making Moulding work on Italian Marble for Window Jamb', unit: 'R.ft.', standardRate: 60.0, preferredRate: 60.0 },
      { itemKey: 'marble_moulding_polish', description: 'Providing Mirror Polish on Moulding edges', unit: 'Sq.ft.', standardRate: 20.0, preferredRate: 18.0 },
      { itemKey: 'chemical_joint_filling', description: 'Providing & Filling Tenax/Epoxy Chemical in Italian Marble Joints', unit: 'Sq.ft.', standardRate: 8.0, preferredRate: 8.0 },
      { itemKey: 'three_coat_mirror_polish', description: 'Providing Three Coat of Silicate/Diamond Polish for Mirror Polish on Floor & Skirting', unit: 'Sq.ft.', standardRate: 20.0, preferredRate: 20.0 },
      { itemKey: 'rcc_lintels_m20', description: 'Providing and Fixing RCC Lintels of M-20 Grade with reinforcement', unit: 'R.ft.', standardRate: 90.0, preferredRate: 85.0 }
    ]
  },
  {
    vendorId: 'ven-pop-1',
    vendorName: 'Gyprock & Elite False Ceilings',
    tradeCategory: 'POP',
    tradeCode: 'B',
    rates: [
      { itemKey: 'pop_punning_walls', description: 'Providing and applying POP Punning on Walls (avg 12mm thickness in line level and plumb)', unit: 'Sq.ft.', standardRate: 13.5, preferredRate: 13.0 },
      { itemKey: 'pop_false_ceiling_gi', description: 'Providing and fixing POP False Ceiling made of standard GI Sections & 12mm POP sheets', unit: 'Sq.ft.', standardRate: 35.0, preferredRate: 33.0 },
      { itemKey: 'ceiling_groove_1_4', description: 'Making 1/4"x1/4" Groove in ceiling with proper line level', unit: 'R.ft.', standardRate: 9.0, preferredRate: 9.0 },
      { itemKey: 'wall_groove_1_4', description: 'Making 1/4"x1/4" Groove in wall with proper finishing', unit: 'R.ft.', standardRate: 9.0, preferredRate: 9.0 },
      { itemKey: 'cove_pelmet_indirect_light', description: 'Providing & Making Pelmet for Indirect Cove Light', unit: 'R.ft.', standardRate: 35.0, preferredRate: 32.0 },
      { itemKey: 'pop_design_ceiling_profile', description: 'Providing and Fixing POP Design False Ceiling with drops, cutouts and sloped profiles', unit: 'Sq.ft.', standardRate: 125.0, preferredRate: 120.0 },
      { itemKey: 'pop_vertical_patta', description: 'Providing and Fixing POP Design False Ceiling vertical patta with light troughs', unit: 'R.ft.', standardRate: 45.0, preferredRate: 42.0 },
      { itemKey: 'floor_covering_pop_sheet', description: 'Floor Covering in Plastic Sheet Laying on it POP protective coat', unit: 'Sq.ft.', standardRate: 10.0, preferredRate: 9.5 },
      { itemKey: 'ceiling_light_cutout_cfl', description: 'Making Cutouts for Ceiling Concealed CFL / Down Lights', unit: 'No.', standardRate: 40.0, preferredRate: 38.0 },
      { itemKey: 'ceiling_light_cutout_halogen', description: 'Making Cutouts for Ceiling Concealed Halogen / COB Spotlights', unit: 'No.', standardRate: 40.0, preferredRate: 38.0 }
    ]
  },
  {
    vendorId: 'ven-elec-1',
    vendorName: 'Voltech Smart MEP & Power Systems',
    tradeCategory: 'Electric Wiring',
    tradeCode: 'C',
    rates: [
      { itemKey: 'light_fan_point_wiring', description: 'Light point & fan point wiring with 1.5 sq mm FRLS copper wire in PVC conduit', unit: 'Nos', standardRate: 325.0, preferredRate: 310.0 },
      { itemKey: 'two_way_point_wiring', description: 'Two way light point wiring complete with loop wire', unit: 'Nos', standardRate: 450.0, preferredRate: 430.0 },
      { itemKey: '6a_plug_point_wiring', description: '6amp plug point wiring on primary circuit', unit: 'Nos', standardRate: 350.0, preferredRate: 340.0 },
      { itemKey: '2_5_sqmm_power_wiring', description: '2.5 sq mm wiring for light & power secondary circuits', unit: 'R.ft.', standardRate: 28.0, preferredRate: 27.0 },
      { itemKey: '4_0_sqmm_ac_power_wiring', description: '4.0 sq mm heavy duty wiring for 1.5T/2.0T AC & power points', unit: 'R.ft.', standardRate: 38.0, preferredRate: 36.0 },
      { itemKey: 'cat5_telephone_wiring', description: 'Telephone & Data wiring (Cat-6/Cat-5e shielded cable)', unit: 'R.ft.', standardRate: 28.0, preferredRate: 27.0 },
      { itemKey: 'rg6_tv_cable_wiring', description: 'RG-6 Coaxial high definition T.V. cable wiring', unit: 'R.ft.', standardRate: 28.0, preferredRate: 27.0 },
      { itemKey: 'pvc_pipe_tv_conduit', description: '2" Heavy P.V.C. concealed conduit pipe for LCD / OLED TV cable routing', unit: 'L/S', standardRate: 380.0, preferredRate: 350.0 },
      { itemKey: 'luminaire_fitting_labor', description: 'CFL, halogen and magnetic track light fitting & connection', unit: 'Nos', standardRate: 65.0, preferredRate: 60.0 },
      { itemKey: 'ceiling_fan_fitting', description: 'Ceiling fan assembly, downrod installation & balancing', unit: 'Nos', standardRate: 100.0, preferredRate: 100.0 },
      { itemKey: 'fan_hook_fixing', description: 'Heavy MS Fan Hook anchoring into concrete slab', unit: 'Nos', standardRate: 185.0, preferredRate: 175.0 },
      { itemKey: 'speaker_wiring_transparent', description: '2 Core Transparent high fidelity speaker wiring (MX Technologies)', unit: 'Nos', standardRate: 375.0, preferredRate: 350.0 },
      { itemKey: 'main_db_mcb_complete', description: 'Main Electrical Distribution Board (DB) with 12-way MCB complete', unit: 'Nos', standardRate: 9800.0, preferredRate: 9500.0 },
      { itemKey: 'elcb_mcb_mds_3phase', description: '63A 3-Phase 100mA ELCB + MCB protection kit (Legrand / Schneider)', unit: 'Nos', standardRate: 3850.0, preferredRate: 3700.0 },
      { itemKey: 'call_bell_point', description: 'Ding-dong electronic call bell point & chime installation', unit: 'Nos', standardRate: 295.0, preferredRate: 280.0 },
      { itemKey: 'foot_light_wiring_set', description: 'Step & low level foot light circuit set', unit: 'Nos', standardRate: 350.0, preferredRate: 330.0 }
    ]
  },
  {
    vendorId: 'ven-switch-1',
    vendorName: 'Schneider & Legrand Modular Hub',
    tradeCategory: 'Electric Switches',
    tradeCode: 'D',
    rates: [
      { itemKey: 'switch_6a', description: '6 Amps Modular 1-Way Switch with silver contact', unit: 'No.', standardRate: 91.0, preferredRate: 88.0 },
      { itemKey: 'socket_6_16a_universal', description: '6/10/13/16 Amps 3-Pin Universal Shuttered Socket with Safety flap', unit: 'No.', standardRate: 350.0, preferredRate: 340.0 },
      { itemKey: 'switch_6a_2way', description: '6 Amps 2-Way Staircase / Bedside Modular Switch', unit: 'No.', standardRate: 111.0, preferredRate: 105.0 },
      { itemKey: 'bell_push_indicator', description: '6 Amps Bell Push with illuminated Neon Indicator', unit: 'No.', standardRate: 183.0, preferredRate: 175.0 },
      { itemKey: 'rj11_tel_jack', description: 'RJ 11 2-Line Shuttered Telephone Jack Module', unit: 'No.', standardRate: 286.0, preferredRate: 275.0 },
      { itemKey: 'tv_cable_socket', description: 'T.V. Coaxial Cable Socket Module with pass-through', unit: 'No.', standardRate: 481.0, preferredRate: 460.0 },
      { itemKey: 'blank_plate_modular', description: '1-Module Blanking Plate insert', unit: 'No.', standardRate: 22.0, preferredRate: 20.0 },
      { itemKey: 'plate_2_module', description: '2 Module Front Grid Plate with Surface/Concealed Metal Box', unit: 'No.', standardRate: 136.0, preferredRate: 130.0 },
      { itemKey: 'plate_4_module', description: '4 Module Front Grid Plate with Metal Box', unit: 'No.', standardRate: 218.0, preferredRate: 210.0 },
      { itemKey: 'plate_6_module', description: '6 Module Front Grid Plate with Metal Box', unit: 'No.', standardRate: 298.0, preferredRate: 285.0 },
      { itemKey: 'plate_8_module', description: '8 Module Front Grid Plate with Metal Box', unit: 'No.', standardRate: 381.0, preferredRate: 365.0 },
      { itemKey: 'rj45_cat6_data_socket', description: 'RJ 45 Cat-6 High Speed Gigabit Data Socket Module', unit: 'No.', standardRate: 97.0, preferredRate: 92.0 }
    ]
  },
  {
    vendorId: 'ven-light-1',
    vendorName: 'Lumina Architectural Illumination',
    tradeCategory: 'Electric Fixtures',
    tradeCode: 'E',
    rates: [
      { itemKey: 'halogen_lamp_12_50', description: '12/50 Round / Square Recessed Halogen / LED Gimbal with Lamp', unit: 'No.', standardRate: 480.0, preferredRate: 450.0 },
      { itemKey: 'recessed_foot_light', description: 'Low level recessed warm white Foot Light with decorative bezel', unit: 'No.', standardRate: 1150.0, preferredRate: 1100.0 },
      { itemKey: 'led_strip_cove_transformer', description: 'High CRI 24V Warm White LED Strip Light with MeanWell Driver', unit: 'R.ft.', standardRate: 750.0, preferredRate: 720.0 },
      { itemKey: 'led_spot_light_transformer', description: 'Deep Anti-Glare LED Spot Light with dimmable driver', unit: 'No.', standardRate: 1400.0, preferredRate: 1350.0 },
      { itemKey: 'wall_sconce_bracket', description: 'Solid Brass / Frosted Glass Up-Down Architectural Wall Bracket', unit: 'No.', standardRate: 3000.0, preferredRate: 2850.0 },
      { itemKey: 'ceiling_speaker_recessed', description: 'Frameless 6.5" 2-Way Ceiling Speaker (80W Peak)', unit: 'No.', standardRate: 750.0, preferredRate: 700.0 },
      { itemKey: 'pendant_hanging_light', description: 'Sculptural Dining / Foyer Pendant Hanging Chandelier', unit: 'No.', standardRate: 3000.0, preferredRate: 2900.0 },
      { itemKey: 'picture_accent_light', description: 'Adjustable Brass Picture & Art Display Luminaire', unit: 'No.', standardRate: 1350.0, preferredRate: 1300.0 },
      { itemKey: 'cfl_linear_troffer', description: '2 x 18W Slim Recessed Profile Light with Diffuser', unit: 'No.', standardRate: 3000.0, preferredRate: 2850.0 },
      { itemKey: 'bldc_ceiling_fan', description: 'Ultra-Quiet BLDC Motor Energy Efficient Ceiling Fan with Remote', unit: 'No.', standardRate: 1250.0, preferredRate: 1200.0 },
      { itemKey: 't5_seamless_batten', description: 'T-5 28W High Output Warm White Seamless Linear Light', unit: 'No.', standardRate: 550.0, preferredRate: 520.0 },
      { itemKey: 'intercom_handset', description: 'Digital Multi-Line Audio Intercom Station with display', unit: 'No.', standardRate: 2000.0, preferredRate: 1950.0 }
    ]
  },
  {
    vendorId: 'ven-wood-1',
    vendorName: 'MasterCraft Custom Joinery & Millwork',
    tradeCategory: 'Carpentry',
    tradeCode: 'F',
    rates: [
      { itemKey: 'pelmet_curtain_ply', description: 'Providing & Fixing Pelmet Curtain in Marine Ply ready for Melamine Polish', unit: 'R.ft.', standardRate: 475.0, preferredRate: 460.0 },
      { itemKey: 'tv_unit_marine_ply_veneer', description: 'Providing & fixing T.V. Unit in 19mm Marine Ply, Back Painted Glass & Veneer with Melamine Polish, internal white laminate (8\'-0" x 8\'-6")', unit: 'Sq.ft.', standardRate: 1375.0, preferredRate: 1350.0 },
      { itemKey: 'wall_paneling_cpwood_veneer', description: 'Providing and Fixing Wooden Paneling on walls (50x37.5mm CP Wood framing @ 600mm c/c, 6mm Marine ply & 4mm natural Veneer with Melamine Polish)', unit: 'Sq.ft.', standardRate: 1025.0, preferredRate: 990.0 },
      { itemKey: 'console_table_marine_ply', description: 'Providing and Making Console Table in 19mm Marine ply with natural veneer finish & SS soft-close hardware (4\'-0" x 2\'-6" x 1\'-3" deep)', unit: 'No.', standardRate: 15000.0, preferredRate: 14500.0 },
      { itemKey: 'db_shoe_unit_laser_cut', description: 'Providing and fixing Main DB Unit with Shoe Storage (15" deep, 19mm Marine ply, Veneer & Steel Laser-cut insert, 3\'-6" x 8\'-6")', unit: 'Sq.ft.', standardRate: 1500.0, preferredRate: 1450.0 },
      { itemKey: 'partition_veneer_glass', description: 'Providing and Fixing Wooden Partition with Veneer and Fluted Glass in CP Wood frame (4\'-9" x 8\'-6")', unit: 'Sq.ft.', standardRate: 750.0, preferredRate: 720.0 },
      { itemKey: 'crockery_unit_marine_ply', description: 'Providing & Making Crockery Unit in Marine plywood with Veneer, 2 soft-close drawers on telescopic channels (6\'-0" x 2\'-6")', unit: 'Sq.ft.', standardRate: 1260.0, preferredRate: 1200.0 },
      { itemKey: 'mirror_paneling_bevelled', description: 'Providing and fixing Mirror Paneling using 19mm Marine ply backing over 6mm imported bevelled mirror with SS studs', unit: 'Sq.ft.', standardRate: 625.0, preferredRate: 600.0 },
      { itemKey: 'main_door_solid_flush', description: 'Providing and fixing Main Door 42mm solid core flush door finished in Composite Leather & Natural Veneer with D-Line SS lock & concealed closer (3\'-0" x 7\'-0")', unit: 'Sq.ft.', standardRate: 2850.0, preferredRate: 2750.0 },
      { itemKey: 'main_safety_door_composite', description: 'Providing and fixing Main Safety Door 42mm solid core finished in Composite leather & SS safety grill with multi-bolt lock (3\'-0" x 7\'-0")', unit: 'Sq.ft.', standardRate: 2850.0, preferredRate: 2750.0 },
      { itemKey: 'main_door_frame_cpwood', description: 'Providing and Fixing Main Door Frame in CP Wood sections (100mm x 62.5mm) embedded in floor with rebates (3\'-0" x 7\'-0")', unit: 'R.ft.', standardRate: 1775.0, preferredRate: 1700.0 },
      { itemKey: 'bar_unit_floating', description: 'Providing & Making Bar Unit with floating display in Marine plywood with outer veneer & interior French polish (6\'-0" x 2\'-6")', unit: 'Sq.ft.', standardRate: 2850.0, preferredRate: 2750.0 },
      { itemKey: 'sliding_door_frame_cpwood', description: 'Providing and Fixing Sliding Door Frame in CP Wood sections (100mm x 62.5mm) with concealed heavy-duty top track', unit: 'R.ft.', standardRate: 975.0, preferredRate: 950.0 }
    ]
  },
  {
    vendorId: 'ven-paint-1',
    vendorName: 'Royale Finishes & Polish Works',
    tradeCategory: 'Paint & Polish',
    tradeCode: 'G',
    rates: [
      { itemKey: 'ceiling_plastic_emulsion', description: 'Providing and Applying Asian Paints Royale Plastic Emulsion on ceiling (2 coats over 1 primer coat with putty/luppum smoothening)', unit: 'Sq.ft.', standardRate: 12.0, preferredRate: 11.5 },
      { itemKey: 'vertical_patta_emulsion', description: 'Providing and Applying Plastic Emulsion on Vertical POP patta surfaces', unit: 'Sq.ft.', standardRate: 12.0, preferredRate: 11.5 },
      { itemKey: 'groove_luster_paint', description: 'Applying Luster / High-Gloss Enamel paint in 1/4" ceiling and wall grooves', unit: 'R.ft.', standardRate: 12.0, preferredRate: 11.0 },
      { itemKey: 'zinc_texture_wall_paint', description: 'Applying Asian Paints Royale Play / Zinc Metallic Texture on accent wall surfaces', unit: 'Sq.ft.', standardRate: 26.0, preferredRate: 25.0 },
      { itemKey: 'french_polish_woodwork', description: 'French Polish: Sand papering, filling with crack sealer, 2 coats imported sealer & hand buffing', unit: 'Sq.ft.', standardRate: 15.0, preferredRate: 14.5 },
      { itemKey: 'melamine_spray_buffing', description: 'Melamine Polish: Spraying 2 coats imported sealer, high-build melamine clear coat & multi-stage mechanical buffing for silky sheen', unit: 'Sq.ft.', standardRate: 40.0, preferredRate: 38.0 }
    ]
  },
  {
    vendorId: 'ven-misc-1',
    vendorName: 'Heritage Decor & Specialist Works',
    tradeCategory: 'Miscellaneous',
    tradeCode: 'H',
    rates: [
      { itemKey: 'anti_termite_treatment', description: 'Comprehensive Anti-Termite Chemical Treatment with 5-Year Warranty', unit: 'L/S', standardRate: 3500.0, preferredRate: 3500.0 },
      { itemKey: 'designer_wallpaper_installation', description: 'Providing and Fixing Designer European Textured Wallpaper (Labour + Adhesives)', unit: 'Sq.ft.', standardRate: 150.0, preferredRate: 140.0 },
      { itemKey: 'ss_planters_450mm', description: 'Providing and placing Brushed 304-Grade Stainless Steel Planters (450mm dia x 450mm ht)', unit: 'Set', standardRate: 7500.0, preferredRate: 7200.0 },
      { itemKey: 'picture_frame_bespoke', description: 'Providing & fixing Bespoke Gallery Picture Frame with anti-reflective museum glass', unit: 'No.', standardRate: 100000.0, preferredRate: 95000.0 },
      { itemKey: 'curated_art_mural', description: 'Providing & fixing Curated 3D Textured Relief Art Mural with LED backlighting', unit: 'No.', standardRate: 250000.0, preferredRate: 240000.0 },
      { itemKey: 'custom_fish_tank_9ft', description: 'Providing & fixing Custom 9\'-0" x 2\'-6" Rimless Glass Aquarium with filtration & lighting', unit: 'L/S', standardRate: 150000.0, preferredRate: 145000.0 },
      { itemKey: 'custom_drapery_curtains', description: 'Providing & fixing Custom Blackout / Sheer Curtains with motorized ripple fold track', unit: 'Sq.ft.', standardRate: 1100.0, preferredRate: 1050.0 }
    ]
  },
  {
    vendorId: 'ven-furn-1',
    vendorName: 'Artefact Luxury Loose Furniture',
    tradeCategory: 'Loose Furniture',
    tradeCode: 'I',
    rates: [
      { itemKey: 'sofa_2_seater_luxury', description: 'Providing & placing Two Seater Luxury Sofa with solid teak frame (Basic fabric Rs.250/mtr included)', unit: 'No.', standardRate: 25000.0, preferredRate: 24000.0 },
      { itemKey: 'sofa_3_seater_luxury', description: 'Providing & placing Three Seater Luxury Sofa with feather-down cushioning', unit: 'No.', standardRate: 35000.0, preferredRate: 33500.0 },
      { itemKey: 'side_table_tempered_glass', description: 'Providing & placing 12mm Tempered Glass & Brushed Brass Side Table', unit: 'No.', standardRate: 15000.0, preferredRate: 14500.0 },
      { itemKey: 'centre_table_glass_brass', description: 'Providing & placing Designer Centre Table with Italian marble top & brass geometric base', unit: 'No.', standardRate: 25000.0, preferredRate: 24000.0 },
      { itemKey: 'indian_divan_seating', description: 'Providing & placing Custom Indian Low-Seating Divan with bolster pillows', unit: 'No.', standardRate: 65000.0, preferredRate: 62000.0 },
      { itemKey: 'accent_puffy_ottoman', description: 'Providing & placing Velvet Upholstered Accent Puffy Ottoman', unit: 'No.', standardRate: 12500.0, preferredRate: 12000.0 },
      { itemKey: 'dining_table_8_seater', description: 'Providing & placing 8-Seater Italian Statuario Marble Dining Table with solid wood base', unit: 'No.', standardRate: 150000.0, preferredRate: 142000.0 },
      { itemKey: 'dining_chair_ergonomic', description: 'Providing & placing Ergonomic Upholstered Dining Chair with solid walnut legs', unit: 'No.', standardRate: 6750.0, preferredRate: 6500.0 }
    ]
  },
  {
    vendorId: 'ven-alum-1',
    vendorName: 'Jindal Fenestration & Glass Tech',
    tradeCategory: 'Aluminium Windows',
    tradeCode: 'J',
    rates: [
      { itemKey: 'sliding_window_1in_section', description: 'Aluminum Silver Anodized Sliding Window in 1" Section of Jindal Make & 5mm Clear Glass (20\'-6" x 6\'-6")', unit: 'Sq.ft.', standardRate: 275.0, preferredRate: 265.0 },
      { itemKey: 'openable_window_1in_section', description: 'Aluminum Silver Anodized Openable Casement Window in 1" Section with friction stays (2\'-6" x 3\'-6")', unit: 'Sq.ft.', standardRate: 325.0, preferredRate: 310.0 }
    ]
  }
];

export const MOCK_ASSIGNED_PROJECT_VENDORS: ProjectVendorAssignment[] = [
  { tradeCode: 'A', tradeName: 'Civil Work', vendorId: 'ven-civil-1', vendorName: 'Apex Civil Infra & Masonry', vendorCategory: 'Civil & Structural Materials', rateCardTier: 'Tier 1 Preferred', rating: 4.9, contactPerson: 'Ramesh Patel', phone: '+91 98201 44551', status: 'Assigned' },
  { tradeCode: 'B', tradeName: 'Plaster of Paris (POP)', vendorId: 'ven-pop-1', vendorName: 'Gyprock & Elite False Ceilings', vendorCategory: 'Paint, Textures & Wall Finishes', rateCardTier: 'Tier 1 Preferred', rating: 4.8, contactPerson: 'Aslam Khan', phone: '+91 98202 77881', status: 'Assigned' },
  { tradeCode: 'C', tradeName: 'Electric Wiring', vendorId: 'ven-elec-1', vendorName: 'Voltech Smart MEP & Power Systems', vendorCategory: 'Electrical, MEP & Lighting', rateCardTier: 'Tier 1 Preferred', rating: 4.9, contactPerson: 'Suresh Sharma', phone: '+91 98203 11223', status: 'Assigned' },
  { tradeCode: 'D', tradeName: 'Electric Switches', vendorId: 'ven-switch-1', vendorName: 'Schneider & Legrand Modular Hub', vendorCategory: 'Electrical, MEP & Lighting', rateCardTier: 'Tier 2 Approved', rating: 4.7, contactPerson: 'Vikas Gupta', phone: '+91 98204 99882', status: 'Assigned' },
  { tradeCode: 'E', tradeName: 'Electric Fixtures', vendorId: 'ven-light-1', vendorName: 'Lumina Architectural Illumination', vendorCategory: 'Electrical, MEP & Lighting', rateCardTier: 'Tier 1 Preferred', rating: 4.9, contactPerson: 'Priya Mehra', phone: '+91 98205 66774', status: 'Assigned' },
  { tradeCode: 'F', tradeName: 'Carpentry & Millwork', vendorId: 'ven-wood-1', vendorName: 'MasterCraft Custom Joinery & Millwork', vendorCategory: 'Millwork & Custom Joinery', rateCardTier: 'Tier 1 Preferred', rating: 5.0, contactPerson: 'Jagjit Singh', phone: '+91 98206 55443', status: 'Assigned' },
  { tradeCode: 'G', tradeName: 'Paint & Polish', vendorId: 'ven-paint-1', vendorName: 'Royale Finishes & Polish Works', vendorCategory: 'Paint, Textures & Wall Finishes', rateCardTier: 'Tier 1 Preferred', rating: 4.8, contactPerson: 'Mohan Lal', phone: '+91 98207 33221', status: 'Assigned' },
  { tradeCode: 'H', tradeName: 'Miscellaneous Works', vendorId: 'ven-misc-1', vendorName: 'Heritage Decor & Specialist Works', vendorCategory: 'Soft Furnishings & Drapes', rateCardTier: 'Tier 2 Approved', rating: 4.6, contactPerson: 'Deepak Varma', phone: '+91 98208 22110', status: 'Assigned' },
  { tradeCode: 'I', tradeName: 'Loose Furniture', vendorId: 'ven-furn-1', vendorName: 'Artefact Luxury Loose Furniture', vendorCategory: 'FF&E & Luxury Furniture', rateCardTier: 'Tier 1 Preferred', rating: 4.9, contactPerson: 'Zoya Merchant', phone: '+91 98209 88776', status: 'Assigned' },
  { tradeCode: 'J', tradeName: 'Aluminium Windows', vendorId: 'ven-alum-1', vendorName: 'Jindal Fenestration & Glass Tech', vendorCategory: 'Glass, Glazing & Metal Works', rateCardTier: 'Tier 1 Preferred', rating: 4.7, contactPerson: 'Girish Jain', phone: '+91 98210 44332', status: 'Assigned' }
];

export const MOCK_MASTER_ESTIMATE_ABIZAR: ProjectMasterEstimate = {
  estimateNo: 'DEMO-ARQ-001 / 999 / 07 / 040509',
  projectCode: 'demo-arq-001',
  projectName: 'Demo Project',
  clientName: 'Demo Client',
  consultantName: 'Demo Project',
  date: '2026-09-04',
  totalCarpetAreaSqFt: 1794.0,
  totalProjectCost: 9785823.25,
  overallRatePerSqFt: 5454.75,
  assignedVendors: MOCK_ASSIGNED_PROJECT_VENDORS,
  approvalInfo: {
    checkedBy: 'Jitendra Mewada (Lead Estimator & Project Lead)',
    approvedBy: 'Director / Managing Partner',
    dateApproved: '2026-09-04',
    clientConfirmedDate: '2026-09-04',
    status: 'Approved'
  },
  rooms: [
    {
      roomId: 'room-living',
      roomName: 'Living / Dining Area',
      roomType: 'Living Area',
      dimensionSpec: {
        lengthFeet: 30,
        lengthInches: 3,
        widthFeet: 30,
        widthInches: 10,
        carpetAreaSqFt: 718.0,
        perimeterRFt: 165.0,
        lintelHeight: "7'-0\"",
        doorSize: "3'-9\"",
        windowCill: "0'-6\"",
        windowHeight: "6'-6\"",
        windowAbove: "1'-10\"",
        windowLength: "20'-6\"",
        beamHeight: "1'-1\"",
        clearHeight: "8'-10\""
      },
      totalRoomAmount: 2958252.25,
      ratePerSqFt: 4120.13,
      percentageOfProject: 30.23,
      annexures: {
        A: {
          id: 'ann-living-a',
          tradeCode: 'A',
          tradeName: 'Civil Work',
          tradeCategory: 'Civil',
          assignedVendorId: 'ven-civil-1',
          assignedVendorName: 'Apex Civil Infra & Masonry',
          vendorRating: 4.9,
          totalAmount: 533673.0,
          items: [
            { id: 'item-a-1', itemNo: 1, description: 'Removing of old 6" Thick brick wall & Lowering the same', quantity: 252.0, unit: 'Sq.ft.', rate: 8.0, amount: 2016.0, category: 'Civil' },
            { id: 'item-a-2', itemNo: 2, description: 'Removing of old 9" Thick brick wall & Lowering the same', quantity: 22.5, unit: 'Sq.ft.', rate: 10.0, amount: 225.0, category: 'Civil' },
            { id: 'item-a-3', itemNo: 3, description: 'Removing of Old Wall Plaster', quantity: 330.0, unit: 'Sq.ft.', rate: 8.0, amount: 2640.0, category: 'Civil' },
            { id: 'item-a-4', itemNo: 4, description: 'Removing Of Door Frame', quantity: 6.0, unit: 'R.ft.', rate: 25.0, amount: 150.0, category: 'Civil' },
            { id: 'item-a-5', itemNo: 5, description: 'Room Floor Cleaning', quantity: 718.0, unit: 'Sq.ft.', rate: 8.0, amount: 5744.0, category: 'Civil' },
            { id: 'item-a-6', itemNo: 6, description: 'Chipping for Cement Slurry', quantity: 718.0, unit: 'Sq.ft.', rate: 5.0, amount: 3590.0, category: 'Civil' },
            { id: 'item-a-7', itemNo: 7, description: 'Providing & Erecting 115mm thk Brick Masonry Wall 1:4 with RCC stiffener', quantity: 16.0, unit: 'Sq.ft.', rate: 35.0, amount: 560.0, category: 'Civil' },
            { id: 'item-a-8', itemNo: 8, description: 'Providing & fixing Main door Wooden frames to Line Level & Plumb', quantity: 2.0, unit: 'No.', rate: 1000.0, amount: 2000.0, category: 'Civil' },
            { id: 'item-a-9', itemNo: 9, description: 'Providing & applying 19mm thk Plaster Double coat 1:4', quantity: 730.0, unit: 'Sq.ft.', rate: 40.0, amount: 29200.0, category: 'Civil' },
            { id: 'item-a-10', itemNo: 10, description: 'Providing & Applying Cement Slurry on floor', quantity: 718.0, unit: 'Sq.ft.', rate: 10.0, amount: 7180.0, category: 'Civil' },
            { id: 'item-a-11', itemNo: 11, description: 'Providing & Making P.C.C. in cement mortar in required slopes', quantity: 718.0, unit: 'Sq.ft.', rate: 30.0, amount: 21540.0, category: 'Civil' },
            { id: 'item-a-12', itemNo: 12, description: 'Providing & Laying Italian Marble flooring (75mm bedding 1:6, matching grout)', quantity: 718.0, unit: 'Sq.ft.', rate: 488.0, amount: 350384.0, category: 'Civil' },
            { id: 'item-a-13', itemNo: 13, description: 'Providing & Fixing Window Jamb with 1.5" thk Italian marble', quantity: 70.0, unit: 'R.ft.', rate: 530.0, amount: 37100.0, category: 'Civil' },
            { id: 'item-a-14', itemNo: 14, description: 'Italian Marble 3" skirting with pencil polish', quantity: 165.0, unit: 'R.ft.', rate: 200.0, amount: 33000.0, category: 'Civil' },
            { id: 'item-a-15', itemNo: 15, description: 'Providing & Making Moulding work on Italian Marble for Window Jamb', quantity: 140.0, unit: 'R.ft.', rate: 60.0, amount: 8400.0, category: 'Civil' },
            { id: 'item-a-16', itemNo: 16, description: 'Providing Mirror Polish on Moulding', quantity: 140.0, unit: 'Sq.ft.', rate: 20.0, amount: 2800.0, category: 'Civil' },
            { id: 'item-a-17', itemNo: 17, description: 'Providing & Filling Chemical in Italian Marble Joints of Floor', quantity: 718.0, unit: 'Sq.ft.', rate: 8.0, amount: 5744.0, category: 'Civil' },
            { id: 'item-a-18', itemNo: 18, description: 'Providing Three Coat of Diamond Polish for Mirror Polish on Floor & Skirting', quantity: 953.0, unit: 'Sq.ft.', rate: 20.0, amount: 19060.0, category: 'Civil' },
            { id: 'item-a-19', itemNo: 19, description: 'Providing & Fixing in position RCC Lintels of M-20 Grade with reinforcement', quantity: 26.0, unit: 'R.ft.', rate: 90.0, amount: 2340.0, category: 'Civil' }
          ]
        },
        B: {
          id: 'ann-living-b',
          tradeCode: 'B',
          tradeName: 'Plaster of Paris Work',
          tradeCategory: 'POP',
          assignedVendorId: 'ven-pop-1',
          assignedVendorName: 'Gyprock & Elite False Ceilings',
          vendorRating: 4.8,
          totalAmount: 94455.5,
          items: [
            { id: 'item-b-1', itemNo: 1, description: 'Providing & applying POP Punning on Walls of avg 12mm thickness', quantity: 1485.0, unit: 'Sq.ft.', rate: 13.5, amount: 20047.5, category: 'POP' },
            { id: 'item-b-2', itemNo: 2, description: 'Providing & fixing Plaster of Paris False Ceiling (GI sections + 12mm POP sheets)', quantity: 1077.0, unit: 'Sq.ft.', rate: 35.0, amount: 37695.0, category: 'POP' },
            { id: 'item-b-3', itemNo: 3, description: 'Making 1/4"x1/4" Groove in ceiling with Proper finishing', quantity: 100.0, unit: 'R.ft.', rate: 9.0, amount: 900.0, category: 'POP' },
            { id: 'item-b-4', itemNo: 4, description: 'Making 1/4"x1/4" Groove in wall with Proper finishing', quantity: 227.0, unit: 'R.ft.', rate: 9.0, amount: 2043.0, category: 'POP' },
            { id: 'item-b-5', itemNo: 5, description: 'Providing & Making Pelmet for Indirect Light', quantity: 143.0, unit: 'R.ft.', rate: 35.0, amount: 5005.0, category: 'POP' },
            { id: 'item-b-6', itemNo: 6, description: 'Providing & Fixing POP Design False Ceiling vertical profile drops', quantity: 110.0, unit: 'Sq.ft.', rate: 125.0, amount: 13750.0, category: 'POP' },
            { id: 'item-b-7', itemNo: 7, description: 'Providing & Fixing POP Design False Ceiling vertical patta', quantity: 143.0, unit: 'R.ft.', rate: 45.0, amount: 6435.0, category: 'POP' },
            { id: 'item-b-8', itemNo: 8, description: 'Floor Covering in Plastic Laying on it POP sheet', quantity: 718.0, unit: 'Sq.ft.', rate: 10.0, amount: 7180.0, category: 'POP' },
            { id: 'item-b-9', itemNo: 9, description: 'Making Cutouts for Ceiling Concealed Downlights (CFL/LED)', quantity: 25.0, unit: 'No.', rate: 40.0, amount: 1000.0, category: 'POP' },
            { id: 'item-b-10', itemNo: 10, description: 'Making Cutouts for Ceiling Concealed Halogen/COB Lights', quantity: 10.0, unit: 'No.', rate: 40.0, amount: 400.0, category: 'POP' }
          ]
        },
        C: {
          id: 'ann-living-c',
          tradeCode: 'C',
          tradeName: 'Electric Wiring Work',
          tradeCategory: 'Electric Wiring',
          assignedVendorId: 'ven-elec-1',
          assignedVendorName: 'Voltech Smart MEP & Power Systems',
          vendorRating: 4.9,
          totalAmount: 49367.0,
          items: [
            { id: 'item-c-1', itemNo: 1, description: 'Light point & fan point wiring', quantity: 26.0, unit: 'Nos', rate: 325.0, amount: 8450.0, category: 'Electric Wiring' },
            { id: 'item-c-2', itemNo: 2, description: 'Two way light point wiring', quantity: 4.0, unit: 'Nos', rate: 450.0, amount: 1800.0, category: 'Electric Wiring' },
            { id: 'item-c-3', itemNo: 3, description: '6amp plug point', quantity: 12.0, unit: 'Nos', rate: 350.0, amount: 4200.0, category: 'Electric Wiring' },
            { id: 'item-c-4', itemNo: 4, description: '2.5 sq mm wiring light & power point', quantity: 216.0, unit: 'R.ft.', rate: 28.0, amount: 6048.0, category: 'Electric Wiring' },
            { id: 'item-c-5', itemNo: 5, description: '4.0 sq mm wiring for a/c & power point wiring', quantity: 115.0, unit: 'R.ft.', rate: 38.0, amount: 4370.0, category: 'Electric Wiring' },
            { id: 'item-c-6', itemNo: 6, description: 'Telephone wiring (Cat-5e)', quantity: 118.0, unit: 'R.ft.', rate: 28.0, amount: 3304.0, category: 'Electric Wiring' },
            { id: 'item-c-7', itemNo: 7, description: 'RG-6 T.V. cable wiring', quantity: 20.0, unit: 'R.ft.', rate: 28.0, amount: 560.0, category: 'Electric Wiring' },
            { id: 'item-c-8', itemNo: 8, description: '2" P.V.C. pipe for L.C.D T.V with fitting', quantity: 1.0, unit: 'L/S', rate: 380.0, amount: 380.0, category: 'Electric Wiring' },
            { id: 'item-c-9', itemNo: 9, description: 'CFL, halogen and tube light fitting', quantity: 24.0, unit: 'Nos', rate: 65.0, amount: 1560.0, category: 'Electric Wiring' },
            { id: 'item-c-10', itemNo: 10, description: 'Ceiling fan fitting', quantity: 2.0, unit: 'Nos', rate: 100.0, amount: 200.0, category: 'Electric Wiring' },
            { id: 'item-c-11', itemNo: 11, description: 'Fan Hook Fixing', quantity: 3.0, unit: 'Nos', rate: 185.0, amount: 555.0, category: 'Electric Wiring' },
            { id: 'item-c-12', itemNo: 12, description: '2 Core Transparent speaker wiring MX technologies', quantity: 8.0, unit: 'Nos', rate: 375.0, amount: 3000.0, category: 'Electric Wiring' },
            { id: 'item-c-13', itemNo: 13, description: 'Main Electrical DB with MCB etc Complete', quantity: 1.0, unit: 'Nos', rate: 9800.0, amount: 9800.0, category: 'Electric Wiring' },
            { id: 'item-c-14', itemNo: 14, description: '63A 3Phase 100ma ELCB+MCB MDS', quantity: 1.0, unit: 'Nos', rate: 3850.0, amount: 3850.0, category: 'Electric Wiring' },
            { id: 'item-c-15', itemNo: 15, description: 'Call Bell Point', quantity: 2.0, unit: 'Nos', rate: 295.0, amount: 590.0, category: 'Electric Wiring' },
            { id: 'item-c-16', itemNo: 16, description: 'Foot Light Set', quantity: 2.0, unit: 'Nos', rate: 350.0, amount: 700.0, category: 'Electric Wiring' }
          ]
        },
        D: {
          id: 'ann-living-d',
          tradeCode: 'D',
          tradeName: 'Electric Switches',
          tradeCategory: 'Electric Switches',
          assignedVendorId: 'ven-switch-1',
          assignedVendorName: 'Schneider & Legrand Modular Hub',
          vendorRating: 4.7,
          totalAmount: 19374.0,
          items: [
            { id: 'item-d-1', itemNo: 1, description: '6 Amps. Switch', quantity: 40.0, unit: 'No.', rate: 91.0, amount: 3640.0, category: 'Electric Switches' },
            { id: 'item-d-2', itemNo: 2, description: '6/10/13 Amps. 2/3 Pin Socket', quantity: 18.0, unit: 'No.', rate: 350.0, amount: 6300.0, category: 'Electric Switches' },
            { id: 'item-d-3', itemNo: 3, description: '6 Amps. 2 Way Switch', quantity: 8.0, unit: 'No.', rate: 111.0, amount: 888.0, category: 'Electric Switches' },
            { id: 'item-d-4', itemNo: 4, description: '6 Amps. Bell Push', quantity: 1.0, unit: 'No.', rate: 183.0, amount: 183.0, category: 'Electric Switches' },
            { id: 'item-d-5', itemNo: 5, description: 'RJ 11 Telephone Jack', quantity: 3.0, unit: 'No.', rate: 286.0, amount: 858.0, category: 'Electric Switches' },
            { id: 'item-d-6', itemNo: 6, description: 'T.V. Cable Socket', quantity: 3.0, unit: 'No.', rate: 481.0, amount: 1443.0, category: 'Electric Switches' },
            { id: 'item-d-7', itemNo: 7, description: 'Blank Plate', quantity: 14.0, unit: 'No.', rate: 22.0, amount: 308.0, category: 'Electric Switches' },
            { id: 'item-d-8', itemNo: 8, description: '2 Module Plate With Box', quantity: 8.0, unit: 'No.', rate: 136.0, amount: 1088.0, category: 'Electric Switches' },
            { id: 'item-d-9', itemNo: 9, description: '4 Module Plate With Box', quantity: 3.0, unit: 'No.', rate: 218.0, amount: 654.0, category: 'Electric Switches' },
            { id: 'item-d-10', itemNo: 10, description: '6 Module Plate With Box', quantity: 8.0, unit: 'No.', rate: 298.0, amount: 2384.0, category: 'Electric Switches' },
            { id: 'item-d-11', itemNo: 11, description: '8 Module Plate With Box', quantity: 3.0, unit: 'No.', rate: 381.0, amount: 1143.0, category: 'Electric Switches' },
            { id: 'item-d-12', itemNo: 12, description: 'RJ 45 Gigabit Data Socket', quantity: 5.0, unit: 'No.', rate: 97.0, amount: 485.0, category: 'Electric Switches' }
          ]
        },
        E: {
          id: 'ann-living-e',
          tradeCode: 'E',
          tradeName: 'Electric Fixtures',
          tradeCategory: 'Electric Fixtures',
          assignedVendorId: 'ven-light-1',
          assignedVendorName: 'Lumina Architectural Illumination',
          vendorRating: 4.9,
          totalAmount: 86280.0,
          items: [
            { id: 'item-e-1', itemNo: 1, description: '12/50 Round/Square Halogen with Lamp', quantity: 16.0, unit: 'No.', rate: 480.0, amount: 7680.0, category: 'Electric Fixtures' },
            { id: 'item-e-2', itemNo: 2, description: 'Foot Light luminaire', quantity: 1.0, unit: 'No.', rate: 1150.0, amount: 1150.0, category: 'Electric Fixtures' },
            { id: 'item-e-3', itemNo: 3, description: 'LED Light with Transformer (Cove Light)', quantity: 21.0, unit: 'R.ft.', rate: 750.0, amount: 15750.0, category: 'Electric Fixtures' },
            { id: 'item-e-4', itemNo: 4, description: 'LED Spot Light with Transformer', quantity: 6.0, unit: 'No.', rate: 1400.0, amount: 8400.0, category: 'Electric Fixtures' },
            { id: 'item-e-5', itemNo: 5, description: 'Wall Bracket Luminaire', quantity: 1.0, unit: 'No.', rate: 3000.0, amount: 3000.0, category: 'Electric Fixtures' },
            { id: 'item-e-6', itemNo: 6, description: 'Ceiling Speaker recessed', quantity: 6.0, unit: 'No.', rate: 750.0, amount: 4500.0, category: 'Electric Fixtures' },
            { id: 'item-e-7', itemNo: 7, description: 'Hanging Pendant Light', quantity: 3.0, unit: 'No.', rate: 3000.0, amount: 9000.0, category: 'Electric Fixtures' },
            { id: 'item-e-8', itemNo: 8, description: 'Picture Light display', quantity: 2.0, unit: 'No.', rate: 1350.0, amount: 2700.0, category: 'Electric Fixtures' },
            { id: 'item-e-9', itemNo: 9, description: '2 x 18 watts CFL Light Fitting', quantity: 1.0, unit: 'No.', rate: 3000.0, amount: 3000.0, category: 'Electric Fixtures' },
            { id: 'item-e-10', itemNo: 10, description: 'Ceiling Fan (High efficiency BLDC)', quantity: 11.0, unit: 'No.', rate: 1250.0, amount: 13750.0, category: 'Electric Fixtures' },
            { id: 'item-e-11', itemNo: 11, description: 'T - 5 Batten Light', quantity: 17.0, unit: 'No.', rate: 550.0, amount: 9350.0, category: 'Electric Fixtures' },
            { id: 'item-e-12', itemNo: 12, description: 'Telephone Intercom station', quantity: 4.0, unit: 'No.', rate: 2000.0, amount: 8000.0, category: 'Electric Fixtures' }
          ]
        },
        F: {
          id: 'ann-living-f',
          tradeCode: 'F',
          tradeName: 'Carpentry Work',
          tradeCategory: 'Carpentry',
          assignedVendorId: 'ven-wood-1',
          assignedVendorName: 'MasterCraft Custom Joinery & Millwork',
          vendorRating: 5.0,
          totalAmount: 1052941.25,
          items: [
            { id: 'item-f-1', itemNo: 1, description: 'Providing & Fixing Pelmet Curtain in Ply ready to receive polish', quantity: 20.5, unit: 'R.ft.', rate: 475.0, amount: 9737.5, category: 'Carpentry' },
            { id: 'item-f-2', itemNo: 2, description: 'Providing & fixing T.V. Unit in 19mm Marine ply, Back Painted Glass & Veneer (8\'-0" x 8\'-6")', quantity: 68.0, unit: 'Sq.ft.', rate: 1375.0, amount: 93500.0, category: 'Carpentry' },
            { id: 'item-f-3', itemNo: 3, description: 'Providing & Fixing Wooden Paneling on walls (CPwood sections @ 600mm c/c, 6mm Marine ply & 4mm Veneer)', quantity: 571.25, unit: 'Sq.ft.', rate: 1025.0, amount: 585531.25, category: 'Carpentry' },
            { id: 'item-f-4', itemNo: 4, description: 'Providing & Making Console Table in 19mm Marine ply with veneer (4\'-0" x 2\'-6" x 1\'-3")', quantity: 1.0, unit: 'No.', rate: 15000.0, amount: 15000.0, category: 'Carpentry' },
            { id: 'item-f-5', itemNo: 5, description: 'Providing & fixing Main D.B.Unit with Shoes Unit (19mm Marine ply, Steel Laser cut, 3\'-6" x 8\'-6")', quantity: 29.75, unit: 'Sq.ft.', rate: 1500.0, amount: 44625.0, category: 'Carpentry' },
            { id: 'item-f-6', itemNo: 6, description: 'Providing & Fixing Wooden Partition with Veneer and Glass (4\'-9" x 8\'-6")', quantity: 40.38, unit: 'Sq.ft.', rate: 750.0, amount: 30285.0, category: 'Carpentry' },
            { id: 'item-f-7', itemNo: 7, description: 'Providing & Making Crockery Unit in Marine plywood with Veneer (6\'-0" x 2\'-6")', quantity: 15.0, unit: 'Sq.ft.', rate: 1260.0, amount: 18900.0, category: 'Carpentry' },
            { id: 'item-f-8', itemNo: 8, description: 'Providing & fixing Mirror Paneling with 19mm Marine ply backing & SS studs', quantity: 46.5, unit: 'Sq.ft.', rate: 625.0, amount: 29062.5, category: 'Carpentry' },
            { id: 'item-f-9', itemNo: 9, description: 'Providing & fixing Main Door solid core flush door 42mm in Composite leather (3\'-0" x 7\'-0")', quantity: 21.0, unit: 'Sq.ft.', rate: 2850.0, amount: 59850.0, category: 'Carpentry' },
            { id: 'item-f-10', itemNo: 10, description: 'Providing & fixing Main Safety door 42mm solid core with multi lock (3\'-0" x 7\'-0")', quantity: 21.0, unit: 'Sq.ft.', rate: 2850.0, amount: 59850.0, category: 'Carpentry' },
            { id: 'item-f-11', itemNo: 11, description: 'Providing & Fixing Main Door Frame in CP sections 100mm x 62.5mm (3\'-0" x 7\'-0")', quantity: 17.0, unit: 'R.ft.', rate: 1775.0, amount: 30175.0, category: 'Carpentry' },
            { id: 'item-f-12', itemNo: 12, description: 'Providing & Making Floating Bar Unit in Marine plywood with Veneer (6\'-0" x 2\'-6")', quantity: 21.0, unit: 'Sq.ft.', rate: 2850.0, amount: 59850.0, category: 'Carpentry' },
            { id: 'item-f-13', itemNo: 13, description: 'Providing & Fixing Sliding Door Frame in CP sections (3\'-0" x 7\'-0")', quantity: 17.0, unit: 'R.ft.', rate: 975.0, amount: 16575.0, category: 'Carpentry' }
          ]
        },
        G: {
          id: 'ann-living-g',
          tradeCode: 'G',
          tradeName: 'Paint & Polish Work',
          tradeCategory: 'Paint & Polish',
          assignedVendorId: 'ven-paint-1',
          assignedVendorName: 'Royale Finishes & Polish Works',
          vendorRating: 4.8,
          totalAmount: 157174.0,
          items: [
            { id: 'item-g-1', itemNo: 1, description: 'Providing and Applying Asian Paints Royale Plastic Emulsion on ceiling', quantity: 1077.0, unit: 'Sq.ft.', rate: 12.0, amount: 12924.0, category: 'Paint & Polish' },
            { id: 'item-g-2', itemNo: 2, description: 'Providing and Applying Plastic Emulsion on Vertical POP Patta', quantity: 143.0, unit: 'Sq.ft.', rate: 12.0, amount: 1716.0, category: 'Paint & Polish' },
            { id: 'item-g-3', itemNo: 3, description: 'Luster / High Gloss Plastic Paint in 1/4" groove', quantity: 327.0, unit: 'R.ft.', rate: 12.0, amount: 3924.0, category: 'Paint & Polish' },
            { id: 'item-g-4', itemNo: 4, description: 'Zinc Textures Metallic Paint on Feature Wall', quantity: 1485.0, unit: 'Sq.ft.', rate: 26.0, amount: 38610.0, category: 'Paint & Polish' },
            { id: 'item-g-5', itemNo: 5, description: 'Melamine Polish: Sand papering, sealer spray & mechanical buffing for rich silky surface', quantity: 2500.0, unit: 'Sq.ft.', rate: 40.0, amount: 100000.0, category: 'Paint & Polish' }
          ]
        },
        H: {
          id: 'ann-living-h',
          tradeCode: 'H',
          tradeName: 'Miscellaneous Work',
          tradeCategory: 'Miscellaneous',
          assignedVendorId: 'ven-misc-1',
          assignedVendorName: 'Heritage Decor & Specialist Works',
          vendorRating: 4.6,
          totalAmount: 516500.0,
          items: [
            { id: 'item-h-1', itemNo: 1, description: 'Comprehensive Anti-Termite Treatment with 5-Year Warranty', quantity: 1.0, unit: 'L/S', rate: 3500.0, amount: 3500.0, category: 'Miscellaneous' },
            { id: 'item-h-2', itemNo: 2, description: 'Providing & Fixing European Designer Textured Wallpaper', quantity: 80.0, unit: 'Sq.ft.', rate: 150.0, amount: 12000.0, category: 'Miscellaneous' },
            { id: 'item-h-3', itemNo: 3, description: 'Brushed Stainless Steel Planters (450mm dia x 450mm ht)', quantity: 4.0, unit: 'Set', rate: 7500.0, amount: 30000.0, category: 'Miscellaneous' },
            { id: 'item-h-4', itemNo: 4, description: 'Providing & fixing Bespoke Gallery Picture Frame', quantity: 1.0, unit: 'No.', rate: 100000.0, amount: 100000.0, category: 'Miscellaneous' },
            { id: 'item-h-5', itemNo: 5, description: 'Providing & fixing Curated 3D Relief Wall Mural', quantity: 1.0, unit: 'No.', rate: 250000.0, amount: 250000.0, category: 'Miscellaneous' },
            { id: 'item-h-6', itemNo: 6, description: 'Providing & fixing Custom Blackout & Sheer Curtains with motorized track', quantity: 110.0, unit: 'Sq.ft.', rate: 1100.0, amount: 121000.0, category: 'Miscellaneous' }
          ]
        },
        I: {
          id: 'ann-living-i',
          tradeCode: 'I',
          tradeName: 'Loose Furniture Work',
          tradeCategory: 'Loose Furniture',
          assignedVendorId: 'ven-furn-1',
          assignedVendorName: 'Artefact Luxury Loose Furniture',
          vendorRating: 4.9,
          totalAmount: 409000.0,
          items: [
            { id: 'item-i-1', itemNo: 1, description: 'Providing & placing Two Seater Sofa (Basic fabric Rs. 250/m)', quantity: 1.0, unit: 'No.', rate: 25000.0, amount: 25000.0, category: 'Loose Furniture' },
            { id: 'item-i-2', itemNo: 2, description: 'Providing & placing Three Seater Sofa (Basic fabric Rs. 250/m)', quantity: 1.0, unit: 'No.', rate: 35000.0, amount: 35000.0, category: 'Loose Furniture' },
            { id: 'item-i-3', itemNo: 3, description: 'Providing & placing Glass Side Table with brass finish', quantity: 2.0, unit: 'No.', rate: 15000.0, amount: 30000.0, category: 'Loose Furniture' },
            { id: 'item-i-4', itemNo: 4, description: 'Providing & placing Glass Centre Table', quantity: 1.0, unit: 'No.', rate: 25000.0, amount: 25000.0, category: 'Loose Furniture' },
            { id: 'item-i-5', itemNo: 5, description: 'Providing & placing Custom Indian Seating Divan', quantity: 1.0, unit: 'No.', rate: 65000.0, amount: 65000.0, category: 'Loose Furniture' },
            { id: 'item-i-6', itemNo: 6, description: 'Providing & placing Velvet Puffy Ottomans', quantity: 2.0, unit: 'No.', rate: 12500.0, amount: 25000.0, category: 'Loose Furniture' },
            { id: 'item-i-7', itemNo: 7, description: 'Providing & placing 8-Seater Statuario Dining Table', quantity: 1.0, unit: 'No.', rate: 150000.0, amount: 150000.0, category: 'Loose Furniture' },
            { id: 'item-i-8', itemNo: 8, description: 'Providing & placing Ergonomic Dining Chairs with walnut legs', quantity: 8.0, unit: 'No.', rate: 6750.0, amount: 54000.0, category: 'Loose Furniture' }
          ]
        },
        J: {
          id: 'ann-living-j',
          tradeCode: 'J',
          tradeName: 'Aluminium Sliding Window Work',
          tradeCategory: 'Aluminium Windows',
          assignedVendorId: 'ven-alum-1',
          assignedVendorName: 'Jindal Fenestration & Glass Tech',
          vendorRating: 4.7,
          totalAmount: 39487.5,
          items: [
            { id: 'item-j-1', itemNo: 1, description: 'Aluminum Silver Anodized Sliding Window in 1" Section Jindal & 5mm Glass (20\'-6" x 6\'-6")', quantity: 133.25, unit: 'Sq.ft.', rate: 275.0, amount: 36643.75, category: 'Aluminium Windows' },
            { id: 'item-j-2', itemNo: 2, description: 'Aluminum Silver Anodized Openable Window in 1" Section Jindal & 5mm Glass (2\'-6" x 3\'-6")', quantity: 8.75, unit: 'Sq.ft.', rate: 325.0, amount: 2843.75, category: 'Aluminium Windows' }
          ]
        }
      }
    },
    {
      roomId: 'room-master-bed',
      roomName: 'Master Bedroom',
      roomType: 'Bedroom',
      dimensionSpec: {
        lengthFeet: 11,
        lengthInches: 0,
        widthFeet: 28,
        widthInches: 3,
        carpetAreaSqFt: 318.0,
        perimeterRFt: 78.5,
        lintelHeight: "7'-0\"",
        doorSize: "3'-3\"",
        windowCill: "2'-6\"",
        windowHeight: "4'-6\"",
        windowAbove: "1'-6\"",
        windowLength: "8'-0\"",
        beamHeight: "1'-0\"",
        clearHeight: "9'-0\""
      },
      totalRoomAmount: 1305548.0,
      ratePerSqFt: 4105.5,
      percentageOfProject: 13.34,
      annexures: {
        A: {
          id: 'ann-mb-a',
          tradeCode: 'A',
          tradeName: 'Civil Work',
          tradeCategory: 'Civil',
          assignedVendorId: 'ven-civil-1',
          assignedVendorName: 'Apex Civil Infra & Masonry',
          vendorRating: 4.9,
          totalAmount: 298279.0,
          items: [
            { id: 'mb-a-1', itemNo: 'A.1', description: 'Floor preparation, screeding & Italian marble / engineered wood substrate leveling', quantity: 318.0, unit: 'Sq.Ft', rate: 210.0, amount: 66780.0, studioDrawingRef: 'DWG-MB-CIV-01' },
            { id: 'mb-a-2', itemNo: 'A.2', description: 'Italian Dyna marble supply, mirror-finish laying with Ardex epoxy adhesive', quantity: 318.0, unit: 'Sq.Ft', rate: 650.0, amount: 206700.0, studioDrawingRef: 'DWG-MB-CIV-02' },
            { id: 'mb-a-3', itemNo: 'A.3', description: 'Concealed chasing in brick walls for conduits, pipes & backfilling with polymer mortar', quantity: 78.5, unit: 'R.Ft', rate: 315.0, amount: 24799.0, studioDrawingRef: 'DWG-MB-CIV-03' }
          ]
        },
        B: {
          id: 'ann-mb-b',
          tradeCode: 'B',
          tradeName: 'Plaster of Paris Work',
          tradeCategory: 'POP',
          assignedVendorId: 'ven-pop-1',
          assignedVendorName: 'Gyprock & Elite False Ceilings',
          vendorRating: 4.8,
          totalAmount: 38026.5,
          items: [
            { id: 'mb-b-1', itemNo: 'B.1', description: 'Saint-Gobain Gyproc false ceiling framing & board fixing with perimeter stepped cove', quantity: 318.0, unit: 'Sq.Ft', rate: 105.0, amount: 33390.0, studioDrawingRef: 'DWG-MB-POP-01' },
            { id: 'mb-b-2', itemNo: 'B.2', description: 'Recessed curtain pelmet box with concealed wooden batten & POP finish', quantity: 24.5, unit: 'R.Ft', rate: 189.24, amount: 4636.5, studioDrawingRef: 'DWG-MB-POP-02' }
          ]
        },
        C: {
          id: 'ann-mb-c',
          tradeCode: 'C',
          tradeName: 'Electric Wiring Work',
          tradeCategory: 'Electric Wiring',
          assignedVendorId: 'ven-elec-1',
          assignedVendorName: 'Voltech Smart MEP & Power Systems',
          vendorRating: 4.9,
          totalAmount: 50997.0,
          items: [
            { id: 'mb-c-1', itemNo: 'C.1', description: 'Concealed point wiring with Polycab FRLS copper multi-strand wire in PVC conduits', quantity: 32.0, unit: 'Points', rate: 1100.0, amount: 35200.0, studioDrawingRef: 'DWG-MB-EL-01' },
            { id: 'mb-c-2', itemNo: 'C.2', description: 'Heavy power points for 2.0 Ton Inverter AC, room heater & AV console setup', quantity: 6.0, unit: 'Points', rate: 1750.0, amount: 10500.0, studioDrawingRef: 'DWG-MB-EL-02' },
            { id: 'mb-c-3', itemNo: 'C.3', description: 'Two-way bedside master switching circuitry & footlight low-voltage cabling', quantity: 1.0, unit: 'Lumpsum', rate: 5297.0, amount: 5297.0, studioDrawingRef: 'DWG-MB-EL-03' }
          ]
        },
        D: {
          id: 'ann-mb-d',
          tradeCode: 'D',
          tradeName: 'Electric Switches',
          tradeCategory: 'Electric Switches',
          assignedVendorId: 'ven-switch-1',
          assignedVendorName: 'Schneider & Legrand Modular Hub',
          vendorRating: 4.7,
          totalAmount: 10651.0,
          items: [
            { id: 'mb-d-1', itemNo: 'D.1', description: 'Schneider Unica Pure Champagne modular cover plates, 10A rocker switches & sockets', quantity: 24.0, unit: 'Nos', rate: 385.0, amount: 9240.0, studioDrawingRef: 'DWG-MB-SW-01' },
            { id: 'mb-d-2', itemNo: 'D.2', description: 'DSI/DALI rotary light dimming modules & smart fan step regulator', quantity: 3.0, unit: 'Nos', rate: 470.33, amount: 1411.0, studioDrawingRef: 'DWG-MB-SW-02' }
          ]
        },
        E: {
          id: 'ann-mb-e',
          tradeCode: 'E',
          tradeName: 'Electric Fixtures',
          tradeCategory: 'Electric Fixtures',
          assignedVendorId: 'ven-light-1',
          assignedVendorName: 'Lumina Architectural Illumination',
          vendorRating: 4.9,
          totalAmount: 72040.0,
          items: [
            { id: 'mb-e-1', itemNo: 'E.1', description: 'Deep recessed anti-glare COB architectural downlights with Bridgelux chip (Warm White)', quantity: 14.0, unit: 'Nos', rate: 1850.0, amount: 25900.0, studioDrawingRef: 'DWG-MB-LT-01' },
            { id: 'mb-e-2', itemNo: 'E.2', description: 'High-density 24V Warm Dim LED strip with aluminum extrusion & frosted diffuser in ceiling cove', quantity: 45.0, unit: 'R.Ft', rate: 480.0, amount: 21600.0, studioDrawingRef: 'DWG-MB-LT-02' },
            { id: 'mb-e-3', itemNo: 'E.3', description: 'Designer bedside articulated reading spotlights with brass arm finish', quantity: 2.0, unit: 'Sets', rate: 12270.0, amount: 24540.0, studioDrawingRef: 'DWG-MB-LT-03' }
          ]
        },
        F: {
          id: 'ann-mb-f',
          tradeCode: 'F',
          tradeName: 'Carpentry Work',
          tradeCategory: 'Carpentry',
          assignedVendorId: 'ven-wood-1',
          assignedVendorName: 'MasterCraft Custom Joinery & Millwork',
          vendorRating: 5.0,
          totalAmount: 463922.0,
          items: [
            { id: 'mb-f-1', itemNo: 'F.1', description: 'Full-height 9ft wardrobe carcass in Century Club Prime BWP ply with natural teak veneer & PU polish', quantity: 145.0, unit: 'Sq.Ft', rate: 2150.0, amount: 311750.0, studioDrawingRef: 'DWG-MB-CARP-01' },
            { id: 'mb-f-2', itemNo: 'F.2', description: 'King-size customized bed back acoustic fluted paneling with concealed wire race', quantity: 68.0, unit: 'Sq.Ft', rate: 1450.0, amount: 98600.0, studioDrawingRef: 'DWG-MB-CARP-02' },
            { id: 'mb-f-3', itemNo: 'F.3', description: 'Floating vanity dresser with soft-close Blum tandem runners and fluted fascia', quantity: 1.0, unit: 'Lumpsum', rate: 53572.0, amount: 53572.0, studioDrawingRef: 'DWG-MB-CARP-03' }
          ]
        },
        G: {
          id: 'ann-mb-g',
          tradeCode: 'G',
          tradeName: 'Paint & Polish Work',
          tradeCategory: 'Paint & Polish',
          assignedVendorId: 'ven-paint-1',
          assignedVendorName: 'Royale Finishes & Polish Works',
          vendorRating: 4.8,
          totalAmount: 58770.0,
          items: [
            { id: 'mb-g-1', itemNo: 'G.1', description: 'Asian Paints Royale Luxury Velvet touch emulsion over double coat acrylic wall putty', quantity: 980.0, unit: 'Sq.Ft', rate: 42.0, amount: 41160.0, studioDrawingRef: 'DWG-MB-PNT-01' },
            { id: 'mb-g-2', itemNo: 'G.2', description: 'Polyurethane (PU) clear matte polish on exposed veneer moldings and door architraves', quantity: 240.0, unit: 'Sq.Ft', rate: 73.375, amount: 17610.0, studioDrawingRef: 'DWG-MB-PNT-02' }
          ]
        },
        H: {
          id: 'ann-mb-h',
          tradeCode: 'H',
          tradeName: 'Miscellaneous Work',
          tradeCategory: 'Miscellaneous',
          assignedVendorId: 'ven-misc-1',
          assignedVendorName: 'Heritage Decor & Specialist Works',
          vendorRating: 4.6,
          totalAmount: 256900.0,
          items: [
            { id: 'mb-h-1', itemNo: 'H.1', description: 'Motorized blackout + sheer drapery system with Somfy ultra-quiet tubular motor', quantity: 2.0, unit: 'Sets', rate: 78500.0, amount: 157000.0, studioDrawingRef: 'DWG-MB-MISC-01' },
            { id: 'mb-h-2', itemNo: 'H.2', description: 'Custom headboard velvet fabric upholstery with high-density polyurethane foam backing', quantity: 1.0, unit: 'Lumpsum', rate: 68500.0, amount: 68500.0, studioDrawingRef: 'DWG-MB-MISC-02' },
            { id: 'mb-h-3', itemNo: 'H.3', description: 'Hafele architectural brass door mortise lock, concealed hinges and magnetic door stops', quantity: 1.0, unit: 'Sets', rate: 31400.0, amount: 31400.0, studioDrawingRef: 'DWG-MB-MISC-03' }
          ]
        },
        I: {
          id: 'ann-mb-i',
          tradeCode: 'I',
          tradeName: 'Loose Furniture Work',
          tradeCategory: 'Loose Furniture',
          assignedVendorId: 'ven-furn-1',
          assignedVendorName: 'Artefact Luxury Loose Furniture',
          vendorRating: 4.9,
          totalAmount: 22000.0,
          items: [
            { id: 'mb-i-1', itemNo: 'I.1', description: 'Custom upholstered bedroom accent lounge pouffe with brass kick-plate base', quantity: 2.0, unit: 'Nos', rate: 11000.0, amount: 22000.0, studioDrawingRef: 'DWG-MB-FURN-01' }
          ]
        },
        J: {
          id: 'ann-mb-j',
          tradeCode: 'J',
          tradeName: 'Aluminium Sliding Window Work',
          tradeCategory: 'Aluminium Windows',
          assignedVendorId: 'ven-alum-1',
          assignedVendorName: 'Jindal Fenestration & Glass Tech',
          vendorRating: 4.7,
          totalAmount: 33962.5,
          items: [
            { id: 'mb-j-1', itemNo: 'J.1', description: 'Jindal heavy section double glazed sound-proof 3-track sliding window with bug mesh', quantity: 36.0, unit: 'Sq.Ft', rate: 943.4, amount: 33962.5, studioDrawingRef: 'DWG-MB-WIN-01' }
          ]
        }
      }
    },
    {
      roomId: 'room-master-bath',
      roomName: 'Master Bathroom',
      roomType: 'Bathroom',
      dimensionSpec: {
        lengthFeet: 13,
        lengthInches: 0,
        widthFeet: 5,
        widthInches: 3,
        carpetAreaSqFt: 70.0,
        perimeterRFt: 36.5,
        lintelHeight: "7'-0\"",
        doorSize: "2'-9\"",
        windowCill: "5'-0\"",
        windowHeight: "2'-0\"",
        windowAbove: "0'-6\"",
        windowLength: "3'-0\"",
        beamHeight: "1'-0\"",
        clearHeight: "8'-6\""
      },
      totalRoomAmount: 672462.25,
      ratePerSqFt: 9606.6,
      percentageOfProject: 6.87,
      annexures: {
        A: {
          id: 'ann-mbath-a',
          tradeCode: 'A',
          tradeName: 'Civil & Plumbing Work',
          tradeCategory: 'Civil',
          assignedVendorId: 'ven-civil-1',
          assignedVendorName: 'Apex Civil Infra & Masonry',
          vendorRating: 4.9,
          totalAmount: 437655.75,
          items: [
            { id: 'mba-a-1', itemNo: 'A.1', description: '3-layer chemical waterproofing (Dr. Fixit Fastflex) with brick-bat coba on sunken slab', quantity: 70.0, unit: 'Sq.Ft', rate: 320.0, amount: 22400.0, studioDrawingRef: 'DWG-MBATH-CIV-01' },
            { id: 'mba-a-2', itemNo: 'A.2', description: 'Full-height Italian Statuario marble wall cladding with epoxy grout & stainless steel clips', quantity: 285.0, unit: 'Sq.Ft', rate: 1150.0, amount: 327750.0, studioDrawingRef: 'DWG-MBATH-CIV-02' },
            { id: 'mba-a-3', itemNo: 'A.3', description: 'Concealed CPVC/UPVC water supply piping (Astral) and silent drainage pipes with floor trap', quantity: 1.0, unit: 'Lumpsum', rate: 87505.75, amount: 87505.75, studioDrawingRef: 'DWG-MBATH-CIV-03' }
          ]
        },
        B: {
          id: 'ann-mbath-b',
          tradeCode: 'B',
          tradeName: 'Plaster of Paris Work',
          tradeCategory: 'POP',
          assignedVendorId: 'ven-pop-1',
          assignedVendorName: 'Gyprock & Elite False Ceilings',
          vendorRating: 4.8,
          totalAmount: 0.0,
          items: []
        },
        C: {
          id: 'ann-mbath-c',
          tradeCode: 'C',
          tradeName: 'Electric Wiring Work',
          tradeCategory: 'Electric Wiring',
          assignedVendorId: 'ven-elec-1',
          assignedVendorName: 'Voltech Smart MEP & Power Systems',
          vendorRating: 4.9,
          totalAmount: 6933.0,
          items: [
            { id: 'mba-c-1', itemNo: 'C.1', description: 'Moisture-proof conduit wiring for ceiling downlights, vanity mirror defogger & geyser point', quantity: 6.0, unit: 'Points', rate: 1155.5, amount: 6933.0, studioDrawingRef: 'DWG-MBATH-EL-01' }
          ]
        },
        D: {
          id: 'ann-mbath-d',
          tradeCode: 'D',
          tradeName: 'Electric Switches',
          tradeCategory: 'Electric Switches',
          assignedVendorId: 'ven-switch-1',
          assignedVendorName: 'Schneider & Legrand Modular Hub',
          vendorRating: 4.7,
          totalAmount: 3121.0,
          items: [
            { id: 'mba-d-1', itemNo: 'D.1', description: 'Water-resistant IP55 modular switch plates with neon indicators and 25A geyser isolator', quantity: 1.0, unit: 'Sets', rate: 3121.0, amount: 3121.0, studioDrawingRef: 'DWG-MBATH-SW-01' }
          ]
        },
        E: {
          id: 'ann-mbath-e',
          tradeCode: 'E',
          tradeName: 'Electric Fixtures',
          tradeCategory: 'Electric Fixtures',
          assignedVendorId: 'ven-light-1',
          assignedVendorName: 'Lumina Architectural Illumination',
          vendorRating: 4.9,
          totalAmount: 6160.0,
          items: [
            { id: 'mba-e-1', itemNo: 'E.1', description: 'IP65 waterproof silicone encapsulated downlights with die-cast aluminum heat sinks', quantity: 4.0, unit: 'Nos', rate: 1540.0, amount: 6160.0, studioDrawingRef: 'DWG-MBATH-LT-01' }
          ]
        },
        F: {
          id: 'ann-mbath-f',
          tradeCode: 'F',
          tradeName: 'Carpentry Work (Vanity & Storage)',
          tradeCategory: 'Carpentry',
          assignedVendorId: 'ven-wood-1',
          assignedVendorName: 'MasterCraft Custom Joinery & Millwork',
          vendorRating: 5.0,
          totalAmount: 202947.5,
          items: [
            { id: 'mba-f-1', itemNo: 'F.1', description: 'Marine-grade 710 ply floating vanity counter with Caesarstone quartz countertop', quantity: 1.0, unit: 'Sets', rate: 124500.0, amount: 124500.0, studioDrawingRef: 'DWG-MBATH-CARP-01' },
            { id: 'mba-f-2', itemNo: 'F.2', description: 'Concealed medicine cabinet with sensor-activated defogger LED mirror and soft-close hinge', quantity: 1.0, unit: 'Sets', rate: 78447.5, amount: 78447.5, studioDrawingRef: 'DWG-MBATH-CARP-02' }
          ]
        },
        G: {
          id: 'ann-mbath-g',
          tradeCode: 'G',
          tradeName: 'Paint & Polish Work',
          tradeCategory: 'Paint & Polish',
          assignedVendorId: 'ven-paint-1',
          assignedVendorName: 'Royale Finishes & Polish Works',
          vendorRating: 4.8,
          totalAmount: 1820.0,
          items: [
            { id: 'mba-g-1', itemNo: 'G.1', description: 'Waterproof anti-fungal epoxy ceiling paint in pure matte white finish', quantity: 70.0, unit: 'Sq.Ft', rate: 26.0, amount: 1820.0, studioDrawingRef: 'DWG-MBATH-PNT-01' }
          ]
        },
        H: {
          id: 'ann-mbath-h',
          tradeCode: 'H',
          tradeName: 'Miscellaneous Work',
          tradeCategory: 'Miscellaneous',
          assignedVendorId: 'ven-misc-1',
          assignedVendorName: 'Heritage Decor & Specialist Works',
          vendorRating: 4.6,
          totalAmount: 12400.0,
          items: [
            { id: 'mba-h-1', itemNo: 'H.1', description: '10mm toughened clear glass shower partition with stainless steel 316 hardware', quantity: 1.0, unit: 'Sets', rate: 12400.0, amount: 12400.0, studioDrawingRef: 'DWG-MBATH-MISC-01' }
          ]
        },
        I: {
          id: 'ann-mbath-i',
          tradeCode: 'I',
          tradeName: 'Loose Furniture Work',
          tradeCategory: 'Loose Furniture',
          assignedVendorId: 'ven-furn-1',
          assignedVendorName: 'Artefact Luxury Loose Furniture',
          vendorRating: 4.9,
          totalAmount: 0.0,
          items: []
        },
        J: {
          id: 'ann-mbath-j',
          tradeCode: 'J',
          tradeName: 'Aluminium Sliding Window Work',
          tradeCategory: 'Aluminium Windows',
          assignedVendorId: 'ven-alum-1',
          assignedVendorName: 'Jindal Fenestration & Glass Tech',
          vendorRating: 4.7,
          totalAmount: 1425.0,
          items: [
            { id: 'mba-j-1', itemNo: 'J.1', description: 'Powder-coated aluminum louvered exhaust window frame with frosted glass louvers', quantity: 6.0, unit: 'Sq.Ft', rate: 237.5, amount: 1425.0, studioDrawingRef: 'DWG-MBATH-WIN-01' }
          ]
        }
      }
    },
    {
      roomId: 'room-bed-1',
      roomName: 'Bedroom 1',
      roomType: 'Bedroom',
      dimensionSpec: {
        lengthFeet: 27,
        lengthInches: 3,
        widthFeet: 10,
        widthInches: 6,
        carpetAreaSqFt: 290.0,
        perimeterRFt: 75.5,
        lintelHeight: "7'-0\"",
        doorSize: "3'-0\"",
        windowCill: "2'-6\"",
        windowHeight: "4'-6\"",
        windowAbove: "1'-6\"",
        windowLength: "8'-0\"",
        beamHeight: "1'-0\"",
        clearHeight: "9'-0\""
      },
      totalRoomAmount: 1236625.25,
      ratePerSqFt: 4264.23,
      percentageOfProject: 12.64,
      annexures: {
        A: {
          id: 'ann-b1-a',
          tradeCode: 'A',
          tradeName: 'Civil Work',
          tradeCategory: 'Civil',
          assignedVendorId: 'ven-civil-1',
          assignedVendorName: 'Apex Civil Infra & Masonry',
          vendorRating: 4.9,
          totalAmount: 138295.0,
          items: [
            { id: 'b1-a-1', itemNo: 'A.1', description: 'Floor screeding and premium vitrified slab tile laying with seamless epoxy grout', quantity: 290.0, unit: 'Sq.Ft', rate: 385.0, amount: 111650.0, studioDrawingRef: 'DWG-B1-CIV-01' },
            { id: 'b1-a-2', itemNo: 'A.2', description: 'Wall chasing for electrical automation conduits and cement patching', quantity: 75.5, unit: 'R.Ft', rate: 352.91, amount: 26645.0, studioDrawingRef: 'DWG-B1-CIV-02' }
          ]
        },
        B: {
          id: 'ann-b1-b',
          tradeCode: 'B',
          tradeName: 'Plaster of Paris Work',
          tradeCategory: 'POP',
          assignedVendorId: 'ven-pop-1',
          assignedVendorName: 'Gyprock & Elite False Ceilings',
          vendorRating: 4.8,
          totalAmount: 32502.5,
          items: [
            { id: 'b1-b-1', itemNo: 'B.1', description: 'Gyproc false ceiling framing with magnetic track recess slot and perimeter cove', quantity: 290.0, unit: 'Sq.Ft', rate: 112.077, amount: 32502.5, studioDrawingRef: 'DWG-B1-POP-01' }
          ]
        },
        C: {
          id: 'ann-b1-c',
          tradeCode: 'C',
          tradeName: 'Electric Wiring Work',
          tradeCategory: 'Electric Wiring',
          assignedVendorId: 'ven-elec-1',
          assignedVendorName: 'Voltech Smart MEP & Power Systems',
          vendorRating: 4.9,
          totalAmount: 34494.0,
          items: [
            { id: 'b1-c-1', itemNo: 'C.1', description: 'Point wiring with copper wire, conduits, junction boxes and load isolation', quantity: 26.0, unit: 'Points', rate: 1100.0, amount: 28600.0, studioDrawingRef: 'DWG-B1-EL-01' },
            { id: 'b1-c-2', itemNo: 'C.2', description: 'AC power circuit and audio-visual communication cabling', quantity: 1.0, unit: 'Lumpsum', rate: 5894.0, amount: 5894.0, studioDrawingRef: 'DWG-B1-EL-02' }
          ]
        },
        D: {
          id: 'ann-b1-d',
          tradeCode: 'D',
          tradeName: 'Electric Switches',
          tradeCategory: 'Electric Switches',
          assignedVendorId: 'ven-switch-1',
          assignedVendorName: 'Schneider & Legrand Modular Hub',
          vendorRating: 4.7,
          totalAmount: 11135.0,
          items: [
            { id: 'b1-d-1', itemNo: 'D.1', description: 'Schneider modular switch grid, plates, smart dimmer and USB charging modules', quantity: 1.0, unit: 'Sets', rate: 11135.0, amount: 11135.0, studioDrawingRef: 'DWG-B1-SW-01' }
          ]
        },
        E: {
          id: 'ann-b1-e',
          tradeCode: 'E',
          tradeName: 'Electric Fixtures',
          tradeCategory: 'Electric Fixtures',
          assignedVendorId: 'ven-light-1',
          assignedVendorName: 'Lumina Architectural Illumination',
          vendorRating: 4.9,
          totalAmount: 68930.0,
          items: [
            { id: 'b1-e-1', itemNo: 'E.1', description: 'Magnetic low-voltage track lighting system with adjustable spotlights and flood modules', quantity: 1.0, unit: 'Sets', rate: 45000.0, amount: 45000.0, studioDrawingRef: 'DWG-B1-LT-01' },
            { id: 'b1-e-2', itemNo: 'E.2', description: 'Warm indirect cove LED strips and bedside reading wall sconces', quantity: 1.0, unit: 'Sets', rate: 23930.0, amount: 23930.0, studioDrawingRef: 'DWG-B1-LT-02' }
          ]
        },
        F: {
          id: 'ann-b1-f',
          tradeCode: 'F',
          tradeName: 'Carpentry Work',
          tradeCategory: 'Carpentry',
          assignedVendorId: 'ven-wood-1',
          assignedVendorName: 'MasterCraft Custom Joinery & Millwork',
          vendorRating: 5.0,
          totalAmount: 445565.0,
          items: [
            { id: 'b1-f-1', itemNo: 'F.1', description: 'Full-height 3-door sliding wardrobe with tinted glass & fluted wood inserts', quantity: 135.0, unit: 'Sq.Ft', rate: 2250.0, amount: 303750.0, studioDrawingRef: 'DWG-B1-CARP-01' },
            { id: 'b1-f-2', itemNo: 'F.2', description: 'Queen-size bed frame with hydraulic gas-lift under-bed storage and integrated side tables', quantity: 1.0, unit: 'Sets', rate: 95000.0, amount: 95000.0, studioDrawingRef: 'DWG-B1-CARP-02' },
            { id: 'b1-f-3', itemNo: 'F.3', description: 'Study workstation console with cable management trough and drawer unit', quantity: 1.0, unit: 'Sets', rate: 46815.0, amount: 46815.0, studioDrawingRef: 'DWG-B1-CARP-03' }
          ]
        },
        G: {
          id: 'ann-b1-g',
          tradeCode: 'G',
          tradeName: 'Paint & Polish Work',
          tradeCategory: 'Paint & Polish',
          assignedVendorId: 'ven-paint-1',
          assignedVendorName: 'Royale Finishes & Polish Works',
          vendorRating: 4.8,
          totalAmount: 56060.0,
          items: [
            { id: 'b1-g-1', itemNo: 'G.1', description: 'Royale Luxury Emulsion coating with base coat sanding & surface sealing', quantity: 920.0, unit: 'Sq.Ft', rate: 42.0, amount: 38640.0, studioDrawingRef: 'DWG-B1-PNT-01' },
            { id: 'b1-g-2', itemNo: 'G.2', description: 'PU Italian wood finish on custom study table and wardrobe open shelving', quantity: 1.0, unit: 'Lumpsum', rate: 17420.0, amount: 17420.0, studioDrawingRef: 'DWG-B1-PNT-02' }
          ]
        },
        H: {
          id: 'ann-b1-h',
          tradeCode: 'H',
          tradeName: 'Miscellaneous Work',
          tradeCategory: 'Miscellaneous',
          assignedVendorId: 'ven-misc-1',
          assignedVendorName: 'Heritage Decor & Specialist Works',
          vendorRating: 4.6,
          totalAmount: 349075.0,
          items: [
            { id: 'b1-h-1', itemNo: 'H.1', description: 'Custom architectural acoustic fluted wall paneling behind bed headboard', quantity: 160.0, unit: 'Sq.Ft', rate: 1650.0, amount: 264000.0, studioDrawingRef: 'DWG-B1-MISC-01' },
            { id: 'b1-h-2', itemNo: 'H.2', description: 'Tailored window drapery, motorized track, blackout lining and brass finials', quantity: 1.0, unit: 'Sets', rate: 85075.0, amount: 85075.0, studioDrawingRef: 'DWG-B1-MISC-02' }
          ]
        },
        I: {
          id: 'ann-b1-i',
          tradeCode: 'I',
          tradeName: 'Loose Furniture Work',
          tradeCategory: 'Loose Furniture',
          assignedVendorId: 'ven-furn-1',
          assignedVendorName: 'Artefact Luxury Loose Furniture',
          vendorRating: 4.9,
          totalAmount: 67500.0,
          items: [
            { id: 'b1-i-1', itemNo: 'I.1', description: 'Ergonomic leather study chair with swivel base & padded accent reading armchair', quantity: 1.0, unit: 'Sets', rate: 67500.0, amount: 67500.0, studioDrawingRef: 'DWG-B1-FURN-01' }
          ]
        },
        J: {
          id: 'ann-b1-j',
          tradeCode: 'J',
          tradeName: 'Aluminium Sliding Window Work',
          tradeCategory: 'Aluminium Windows',
          assignedVendorId: 'ven-alum-1',
          assignedVendorName: 'Jindal Fenestration & Glass Tech',
          vendorRating: 4.7,
          totalAmount: 33068.75,
          items: [
            { id: 'b1-j-1', itemNo: 'J.1', description: 'Jindal high-spec 3-track sliding window with safety toughened glass & stainless steel hardware', quantity: 35.0, unit: 'Sq.Ft', rate: 944.82, amount: 33068.75, studioDrawingRef: 'DWG-B1-WIN-01' }
          ]
        }
      }
    },
    {
      roomId: 'room-bed-1-bath',
      roomName: 'Bedroom 1 Bathroom',
      roomType: 'Bathroom',
      dimensionSpec: {
        lengthFeet: 9,
        lengthInches: 10,
        widthFeet: 4,
        widthInches: 6,
        carpetAreaSqFt: 46.0,
        perimeterRFt: 28.5,
        lintelHeight: "7'-0\"",
        doorSize: "2'-6\"",
        windowCill: "5'-0\"",
        windowHeight: "2'-0\"",
        windowAbove: "0'-6\"",
        windowLength: "2'-6\"",
        beamHeight: "1'-0\"",
        clearHeight: "8'-6\""
      },
      totalRoomAmount: 555265.75,
      ratePerSqFt: 12070.99,
      percentageOfProject: 5.67,
      annexures: {
        A: {
          id: 'ann-b1bath-a',
          tradeCode: 'A',
          tradeName: 'Civil & Plumbing Work',
          tradeCategory: 'Civil',
          assignedVendorId: 'ven-civil-1',
          assignedVendorName: 'Apex Civil Infra & Masonry',
          vendorRating: 4.9,
          totalAmount: 370264.75,
          items: [
            { id: 'b1ba-a-1', itemNo: 'A.1', description: 'Waterproofing & full height terrazzo tile cladding with concealed Kohler plumbing core', quantity: 1.0, unit: 'Lumpsum', rate: 370264.75, amount: 370264.75, studioDrawingRef: 'DWG-B1BATH-CIV-01' }
          ]
        },
        B: {
          id: 'ann-b1bath-b',
          tradeCode: 'B',
          tradeName: 'Plaster of Paris Work',
          tradeCategory: 'POP',
          assignedVendorId: 'ven-pop-1',
          assignedVendorName: 'Gyprock & Elite False Ceilings',
          vendorRating: 4.8,
          totalAmount: 0.0,
          items: []
        },
        C: {
          id: 'ann-b1bath-c',
          tradeCode: 'C',
          tradeName: 'Electric Wiring Work',
          tradeCategory: 'Electric Wiring',
          assignedVendorId: 'ven-elec-1',
          assignedVendorName: 'Voltech Smart MEP & Power Systems',
          vendorRating: 4.9,
          totalAmount: 6970.0,
          items: [
            { id: 'b1ba-c-1', itemNo: 'C.1', description: 'Bathroom moisture-sealed circuit wiring and mirror backlighting point', quantity: 6.0, unit: 'Points', rate: 1161.67, amount: 6970.0, studioDrawingRef: 'DWG-B1BATH-EL-01' }
          ]
        },
        D: {
          id: 'ann-b1bath-d',
          tradeCode: 'D',
          tradeName: 'Electric Switches',
          tradeCategory: 'Electric Switches',
          assignedVendorId: 'ven-switch-1',
          assignedVendorName: 'Schneider & Legrand Modular Hub',
          vendorRating: 4.7,
          totalAmount: 2185.0,
          items: [
            { id: 'b1ba-d-1', itemNo: 'D.1', description: 'Modular sealed splash-proof switch plates and geyser control unit', quantity: 1.0, unit: 'Sets', rate: 2185.0, amount: 2185.0, studioDrawingRef: 'DWG-B1BATH-SW-01' }
          ]
        },
        E: {
          id: 'ann-b1bath-e',
          tradeCode: 'E',
          tradeName: 'Electric Fixtures',
          tradeCategory: 'Electric Fixtures',
          assignedVendorId: 'ven-light-1',
          assignedVendorName: 'Lumina Architectural Illumination',
          vendorRating: 4.9,
          totalAmount: 5610.0,
          items: [
            { id: 'b1ba-e-1', itemNo: 'E.1', description: 'Recessed waterproof downlights and shower ceiling accent strip', quantity: 1.0, unit: 'Sets', rate: 5610.0, amount: 5610.0, studioDrawingRef: 'DWG-B1BATH-LT-01' }
          ]
        },
        F: {
          id: 'ann-b1bath-f',
          tradeCode: 'F',
          tradeName: 'Carpentry Work',
          tradeCategory: 'Carpentry',
          assignedVendorId: 'ven-wood-1',
          assignedVendorName: 'MasterCraft Custom Joinery & Millwork',
          vendorRating: 5.0,
          totalAmount: 155215.0,
          items: [
            { id: 'b1ba-f-1', itemNo: 'F.1', description: 'Custom floating marine ply vanity cabinet with quartz top & LED mirror unit', quantity: 1.0, unit: 'Sets', rate: 155215.0, amount: 155215.0, studioDrawingRef: 'DWG-B1BATH-CARP-01' }
          ]
        },
        G: {
          id: 'ann-b1bath-g',
          tradeCode: 'G',
          tradeName: 'Paint & Polish Work',
          tradeCategory: 'Paint & Polish',
          assignedVendorId: 'ven-paint-1',
          assignedVendorName: 'Royale Finishes & Polish Works',
          vendorRating: 4.8,
          totalAmount: 1196.0,
          items: [
            { id: 'b1ba-g-1', itemNo: 'G.1', description: 'Anti-fungal waterproof ceiling paint application', quantity: 46.0, unit: 'Sq.Ft', rate: 26.0, amount: 1196.0, studioDrawingRef: 'DWG-B1BATH-PNT-01' }
          ]
        },
        H: {
          id: 'ann-b1bath-h',
          tradeCode: 'H',
          tradeName: 'Miscellaneous Work',
          tradeCategory: 'Miscellaneous',
          assignedVendorId: 'ven-misc-1',
          assignedVendorName: 'Heritage Decor & Specialist Works',
          vendorRating: 4.6,
          totalAmount: 12400.0,
          items: [
            { id: 'b1ba-h-1', itemNo: 'H.1', description: 'Toughened glass fixed shower partition & robe hooks', quantity: 1.0, unit: 'Sets', rate: 12400.0, amount: 12400.0, studioDrawingRef: 'DWG-B1BATH-MISC-01' }
          ]
        },
        I: {
          id: 'ann-b1bath-i',
          tradeCode: 'I',
          tradeName: 'Loose Furniture Work',
          tradeCategory: 'Loose Furniture',
          assignedVendorId: 'ven-furn-1',
          assignedVendorName: 'Artefact Luxury Loose Furniture',
          vendorRating: 4.9,
          totalAmount: 0.0,
          items: []
        },
        J: {
          id: 'ann-b1bath-j',
          tradeCode: 'J',
          tradeName: 'Aluminium Sliding Window Work',
          tradeCategory: 'Aluminium Windows',
          assignedVendorId: 'ven-alum-1',
          assignedVendorName: 'Jindal Fenestration & Glass Tech',
          vendorRating: 4.7,
          totalAmount: 1425.0,
          items: [
            { id: 'b1ba-j-1', itemNo: 'J.1', description: 'Louvered exhaust aluminum window with bug mesh', quantity: 1.0, unit: 'Sets', rate: 1425.0, amount: 1425.0, studioDrawingRef: 'DWG-B1BATH-WIN-01' }
          ]
        }
      }
    },
    {
      roomId: 'room-children-bed',
      roomName: 'Children Bedroom',
      roomType: 'Bedroom',
      dimensionSpec: {
        lengthFeet: 16,
        lengthInches: 0,
        widthFeet: 12,
        widthInches: 6,
        carpetAreaSqFt: 164.0,
        perimeterRFt: 57.0,
        lintelHeight: "7'-0\"",
        doorSize: "3'-0\"",
        windowCill: "2'-6\"",
        windowHeight: "4'-6\"",
        windowAbove: "1'-6\"",
        windowLength: "6'-0\"",
        beamHeight: "1'-0\"",
        clearHeight: "9'-0\""
      },
      totalRoomAmount: 692550.0,
      ratePerSqFt: 4222.87,
      percentageOfProject: 7.08,
      annexures: {
        A: {
          id: 'ann-cb-a',
          tradeCode: 'A',
          tradeName: 'Civil Work',
          tradeCategory: 'Civil',
          assignedVendorId: 'ven-civil-1',
          assignedVendorName: 'Apex Civil Infra & Masonry',
          vendorRating: 4.9,
          totalAmount: 84809.0,
          items: [
            { id: 'cb-a-1', itemNo: 'A.1', description: 'Floor screeding and acoustic cork / wood composite flooring installation', quantity: 164.0, unit: 'Sq.Ft', rate: 517.13, amount: 84809.0, studioDrawingRef: 'DWG-CB-CIV-01' }
          ]
        },
        B: {
          id: 'ann-cb-b',
          tradeCode: 'B',
          tradeName: 'Plaster of Paris Work',
          tradeCategory: 'POP',
          assignedVendorId: 'ven-pop-1',
          assignedVendorName: 'Gyprock & Elite False Ceilings',
          vendorRating: 4.8,
          totalAmount: 22704.5,
          items: [
            { id: 'cb-b-1', itemNo: 'B.1', description: 'Gyproc false ceiling with playful star-punched light cutouts and indirect cove', quantity: 164.0, unit: 'Sq.Ft', rate: 138.44, amount: 22704.5, studioDrawingRef: 'DWG-CB-POP-01' }
          ]
        },
        C: {
          id: 'ann-cb-c',
          tradeCode: 'C',
          tradeName: 'Electric Wiring Work',
          tradeCategory: 'Electric Wiring',
          assignedVendorId: 'ven-elec-1',
          assignedVendorName: 'Voltech Smart MEP & Power Systems',
          vendorRating: 4.9,
          totalAmount: 17179.0,
          items: [
            { id: 'cb-c-1', itemNo: 'C.1', description: 'Safety point wiring with child-proof shutter sockets and study desk power track', quantity: 1.0, unit: 'Lumpsum', rate: 17179.0, amount: 17179.0, studioDrawingRef: 'DWG-CB-EL-01' }
          ]
        },
        D: {
          id: 'ann-cb-d',
          tradeCode: 'D',
          tradeName: 'Electric Switches',
          tradeCategory: 'Electric Switches',
          assignedVendorId: 'ven-switch-1',
          assignedVendorName: 'Schneider & Legrand Modular Hub',
          vendorRating: 4.7,
          totalAmount: 6226.0,
          items: [
            { id: 'cb-d-1', itemNo: 'D.1', description: 'Schneider child-safety modular switches and USB charging wall plates', quantity: 1.0, unit: 'Sets', rate: 6226.0, amount: 6226.0, studioDrawingRef: 'DWG-CB-SW-01' }
          ]
        },
        E: {
          id: 'ann-cb-e',
          tradeCode: 'E',
          tradeName: 'Electric Fixtures',
          tradeCategory: 'Electric Fixtures',
          assignedVendorId: 'ven-light-1',
          assignedVendorName: 'Lumina Architectural Illumination',
          vendorRating: 4.9,
          totalAmount: 53630.0,
          items: [
            { id: 'cb-e-1', itemNo: 'E.1', description: 'Eye-safety glare-free study luminaire, magnetic track lights & pendant chandelier', quantity: 1.0, unit: 'Sets', rate: 53630.0, amount: 53630.0, studioDrawingRef: 'DWG-CB-LT-01' }
          ]
        },
        F: {
          id: 'ann-cb-f',
          tradeCode: 'F',
          tradeName: 'Carpentry Work',
          tradeCategory: 'Carpentry',
          assignedVendorId: 'ven-wood-1',
          assignedVendorName: 'MasterCraft Custom Joinery & Millwork',
          vendorRating: 5.0,
          totalAmount: 278603.5,
          items: [
            { id: 'cb-f-1', itemNo: 'F.1', description: 'Custom modular wardrobe with chalkboard finish section, study desk, shelves and bunk bed unit', quantity: 1.0, unit: 'Lumpsum', rate: 278603.5, amount: 278603.5, studioDrawingRef: 'DWG-CB-CARP-01' }
          ]
        },
        G: {
          id: 'ann-cb-g',
          tradeCode: 'G',
          tradeName: 'Paint & Polish Work',
          tradeCategory: 'Paint & Polish',
          assignedVendorId: 'ven-paint-1',
          assignedVendorName: 'Royale Finishes & Polish Works',
          vendorRating: 4.8,
          totalAmount: 39898.0,
          items: [
            { id: 'cb-g-1', itemNo: 'G.1', description: 'Washable silk sheen paint with geometric dual-tone accent mural on main study wall', quantity: 1.0, unit: 'Lumpsum', rate: 39898.0, amount: 39898.0, studioDrawingRef: 'DWG-CB-PNT-01' }
          ]
        },
        H: {
          id: 'ann-cb-h',
          tradeCode: 'H',
          tradeName: 'Miscellaneous Work',
          tradeCategory: 'Miscellaneous',
          assignedVendorId: 'ven-misc-1',
          assignedVendorName: 'Heritage Decor & Specialist Works',
          vendorRating: 4.6,
          totalAmount: 153200.0,
          items: [
            { id: 'cb-h-1', itemNo: 'H.1', description: 'Acoustic wall absorption panels, magnetic pin board and motorized blackout curtains', quantity: 1.0, unit: 'Sets', rate: 153200.0, amount: 153200.0, studioDrawingRef: 'DWG-CB-MISC-01' }
          ]
        },
        I: {
          id: 'ann-cb-i',
          tradeCode: 'I',
          tradeName: 'Loose Furniture Work',
          tradeCategory: 'Loose Furniture',
          assignedVendorId: 'ven-furn-1',
          assignedVendorName: 'Artefact Luxury Loose Furniture',
          vendorRating: 4.9,
          totalAmount: 19250.0,
          items: [
            { id: 'cb-i-1', itemNo: 'I.1', description: 'Ergonomic height-adjustable study chair & soft bean pouffe', quantity: 1.0, unit: 'Sets', rate: 19250.0, amount: 19250.0, studioDrawingRef: 'DWG-CB-FURN-01' }
          ]
        },
        J: {
          id: 'ann-cb-j',
          tradeCode: 'J',
          tradeName: 'Aluminium Sliding Window Work',
          tradeCategory: 'Aluminium Windows',
          assignedVendorId: 'ven-alum-1',
          assignedVendorName: 'Jindal Fenestration & Glass Tech',
          vendorRating: 4.7,
          totalAmount: 17050.0,
          items: [
            { id: 'cb-j-1', itemNo: 'J.1', description: 'Safety-lock 3-track sliding window with safety grille and mosquito net mesh', quantity: 18.0, unit: 'Sq.Ft', rate: 947.22, amount: 17050.0, studioDrawingRef: 'DWG-CB-WIN-01' }
          ]
        }
      }
    },
    {
      roomId: 'room-powder',
      roomName: 'Powder Room',
      roomType: 'Bathroom',
      dimensionSpec: {
        lengthFeet: 8,
        lengthInches: 3,
        widthFeet: 5,
        widthInches: 6,
        carpetAreaSqFt: 42.0,
        perimeterRFt: 27.5,
        lintelHeight: "7'-0\"",
        doorSize: "2'-6\"",
        windowCill: "5'-0\"",
        windowHeight: "2'-0\"",
        windowAbove: "0'-6\"",
        windowLength: "2'-0\"",
        beamHeight: "1'-0\"",
        clearHeight: "8'-6\""
      },
      totalRoomAmount: 507038.0,
      ratePerSqFt: 12072.33,
      percentageOfProject: 5.18,
      annexures: {
        A: {
          id: 'ann-pr-a',
          tradeCode: 'A',
          tradeName: 'Civil & Plumbing Work',
          tradeCategory: 'Civil',
          assignedVendorId: 'ven-civil-1',
          assignedVendorName: 'Apex Civil Infra & Masonry',
          vendorRating: 4.9,
          totalAmount: 352910.0,
          items: [
            { id: 'pr-a-1', itemNo: 'A.1', description: 'Dark Marquina Italian marble floor & wall cladding with brass inlay strips and concealed plumbing', quantity: 1.0, unit: 'Lumpsum', rate: 352910.0, amount: 352910.0, studioDrawingRef: 'DWG-PR-CIV-01' }
          ]
        },
        B: {
          id: 'ann-pr-b',
          tradeCode: 'B',
          tradeName: 'Plaster of Paris Work',
          tradeCategory: 'POP',
          assignedVendorId: 'ven-pop-1',
          assignedVendorName: 'Gyprock & Elite False Ceilings',
          vendorRating: 4.8,
          totalAmount: 0.0,
          items: []
        },
        C: {
          id: 'ann-pr-c',
          tradeCode: 'C',
          tradeName: 'Electric Wiring Work',
          tradeCategory: 'Electric Wiring',
          assignedVendorId: 'ven-elec-1',
          assignedVendorName: 'Voltech Smart MEP & Power Systems',
          vendorRating: 4.9,
          totalAmount: 6642.0,
          items: [
            { id: 'pr-c-1', itemNo: 'C.1', description: 'Sensor automation wiring, accent drop pendant light circuit and exhaust points', quantity: 1.0, unit: 'Lumpsum', rate: 6642.0, amount: 6642.0, studioDrawingRef: 'DWG-PR-EL-01' }
          ]
        },
        D: {
          id: 'ann-pr-d',
          tradeCode: 'D',
          tradeName: 'Electric Switches',
          tradeCategory: 'Electric Switches',
          assignedVendorId: 'ven-switch-1',
          assignedVendorName: 'Schneider & Legrand Modular Hub',
          vendorRating: 4.7,
          totalAmount: 2094.0,
          items: [
            { id: 'pr-d-1', itemNo: 'D.1', description: 'Schneider matte black touch switch plate with illuminated icon indicators', quantity: 1.0, unit: 'Sets', rate: 2094.0, amount: 2094.0, studioDrawingRef: 'DWG-PR-SW-01' }
          ]
        },
        E: {
          id: 'ann-pr-e',
          tradeCode: 'E',
          tradeName: 'Electric Fixtures',
          tradeCategory: 'Electric Fixtures',
          assignedVendorId: 'ven-light-1',
          assignedVendorName: 'Lumina Architectural Illumination',
          vendorRating: 4.9,
          totalAmount: 4650.0,
          items: [
            { id: 'pr-e-1', itemNo: 'E.1', description: 'Custom brass cylindrical pendant light & vanity mirror halo glow strip', quantity: 1.0, unit: 'Sets', rate: 4650.0, amount: 4650.0, studioDrawingRef: 'DWG-PR-LT-01' }
          ]
        },
        F: {
          id: 'ann-pr-f',
          tradeCode: 'F',
          tradeName: 'Carpentry Work',
          tradeCategory: 'Carpentry',
          assignedVendorId: 'ven-wood-1',
          assignedVendorName: 'MasterCraft Custom Joinery & Millwork',
          vendorRating: 5.0,
          totalAmount: 118700.0,
          items: [
            { id: 'pr-f-1', itemNo: 'F.1', description: 'Curved solid teak vanity console with monolithic river stone washbasin integration', quantity: 1.0, unit: 'Sets', rate: 118700.0, amount: 118700.0, studioDrawingRef: 'DWG-PR-CARP-01' }
          ]
        },
        G: {
          id: 'ann-pr-g',
          tradeCode: 'G',
          tradeName: 'Paint & Polish Work',
          tradeCategory: 'Paint & Polish',
          assignedVendorId: 'ven-paint-1',
          assignedVendorName: 'Royale Finishes & Polish Works',
          vendorRating: 4.8,
          totalAmount: 1092.0,
          items: [
            { id: 'pr-g-1', itemNo: 'G.1', description: 'Moisture resistant charcoal ceiling paint', quantity: 42.0, unit: 'Sq.Ft', rate: 26.0, amount: 1092.0, studioDrawingRef: 'DWG-PR-PNT-01' }
          ]
        },
        H: {
          id: 'ann-pr-h',
          tradeCode: 'H',
          tradeName: 'Miscellaneous Work',
          tradeCategory: 'Miscellaneous',
          assignedVendorId: 'ven-misc-1',
          assignedVendorName: 'Heritage Decor & Specialist Works',
          vendorRating: 4.6,
          totalAmount: 19525.0,
          items: [
            { id: 'pr-h-1', itemNo: 'H.1', description: 'Wall-mounted brushed gold faucet, waste coupling, bottle trap and towel rail', quantity: 1.0, unit: 'Sets', rate: 19525.0, amount: 19525.0, studioDrawingRef: 'DWG-PR-MISC-01' }
          ]
        },
        I: {
          id: 'ann-pr-i',
          tradeCode: 'I',
          tradeName: 'Loose Furniture Work',
          tradeCategory: 'Loose Furniture',
          assignedVendorId: 'ven-furn-1',
          assignedVendorName: 'Artefact Luxury Loose Furniture',
          vendorRating: 4.9,
          totalAmount: 0.0,
          items: []
        },
        J: {
          id: 'ann-pr-j',
          tradeCode: 'J',
          tradeName: 'Aluminium Sliding Window Work',
          tradeCategory: 'Aluminium Windows',
          assignedVendorId: 'ven-alum-1',
          assignedVendorName: 'Jindal Fenestration & Glass Tech',
          vendorRating: 4.7,
          totalAmount: 1425.0,
          items: [
            { id: 'pr-j-1', itemNo: 'J.1', description: 'Louvered exhaust ventilator with insect screen', quantity: 1.0, unit: 'Sets', rate: 1425.0, amount: 1425.0, studioDrawingRef: 'DWG-PR-WIN-01' }
          ]
        }
      }
    },
    {
      roomId: 'room-kitchen',
      roomName: 'Kitchen',
      roomType: 'Kitchen',
      dimensionSpec: {
        lengthFeet: 10,
        lengthInches: 9,
        widthFeet: 10,
        widthInches: 9,
        carpetAreaSqFt: 109.0,
        perimeterRFt: 43.0,
        lintelHeight: "7'-0\"",
        doorSize: "3'-0\"",
        windowCill: "3'-6\"",
        windowHeight: "3'-6\"",
        windowAbove: "1'-0\"",
        windowLength: "4'-0\"",
        beamHeight: "1'-0\"",
        clearHeight: "9'-0\""
      },
      totalRoomAmount: 517032.25,
      ratePerSqFt: 4743.42,
      percentageOfProject: 5.28,
      annexures: {
        A: {
          id: 'ann-kit-a',
          tradeCode: 'A',
          tradeName: 'Civil & Plumbing Work',
          tradeCategory: 'Civil',
          assignedVendorId: 'ven-civil-1',
          assignedVendorName: 'Apex Civil Infra & Masonry',
          vendorRating: 4.9,
          totalAmount: 235840.5,
          items: [
            { id: 'kit-a-1', itemNo: 'A.1', description: 'Floor screed, non-skid flooring & Caesarstone quartz counter platform slab with sink cutouts', quantity: 1.0, unit: 'Lumpsum', rate: 185000.0, amount: 185000.0, studioDrawingRef: 'DWG-KIT-CIV-01' },
            { id: 'kit-a-2', itemNo: 'A.2', description: 'CPVC hot & cold plumbing for sink, RO, dishwasher and gas piping chase', quantity: 1.0, unit: 'Lumpsum', rate: 50840.5, amount: 50840.5, studioDrawingRef: 'DWG-KIT-CIV-02' }
          ]
        },
        B: {
          id: 'ann-kit-b',
          tradeCode: 'B',
          tradeName: 'Plaster of Paris Work',
          tradeCategory: 'POP',
          assignedVendorId: 'ven-pop-1',
          assignedVendorName: 'Gyprock & Elite False Ceilings',
          vendorRating: 4.8,
          totalAmount: 8797.5,
          items: [
            { id: 'kit-b-1', itemNo: 'B.1', description: 'Saint-Gobain moisture-shield ceiling with exhaust duct cutouts', quantity: 109.0, unit: 'Sq.Ft', rate: 80.71, amount: 8797.5, studioDrawingRef: 'DWG-KIT-POP-01' }
          ]
        },
        C: {
          id: 'ann-kit-c',
          tradeCode: 'C',
          tradeName: 'Electric Wiring Work',
          tradeCategory: 'Electric Wiring',
          assignedVendorId: 'ven-elec-1',
          assignedVendorName: 'Voltech Smart MEP & Power Systems',
          vendorRating: 4.9,
          totalAmount: 13460.0,
          items: [
            { id: 'kit-c-1', itemNo: 'C.1', description: 'Heavy appliance dedicated circuits (Hob, Chimney, Oven, Microwave, Dishwasher, Refrigerator)', quantity: 1.0, unit: 'Lumpsum', rate: 13460.0, amount: 13460.0, studioDrawingRef: 'DWG-KIT-EL-01' }
          ]
        },
        D: {
          id: 'ann-kit-d',
          tradeCode: 'D',
          tradeName: 'Electric Switches',
          tradeCategory: 'Electric Switches',
          assignedVendorId: 'ven-switch-1',
          assignedVendorName: 'Schneider & Legrand Modular Hub',
          vendorRating: 4.7,
          totalAmount: 5741.0,
          items: [
            { id: 'kit-d-1', itemNo: 'D.1', description: 'Schneider 16A/25A appliance sockets, counter-top modular pop-up boxes & MCB sub-panel', quantity: 1.0, unit: 'Sets', rate: 5741.0, amount: 5741.0, studioDrawingRef: 'DWG-KIT-SW-01' }
          ]
        },
        E: {
          id: 'ann-kit-e',
          tradeCode: 'E',
          tradeName: 'Electric Fixtures',
          tradeCategory: 'Electric Fixtures',
          assignedVendorId: 'ven-light-1',
          assignedVendorName: 'Lumina Architectural Illumination',
          vendorRating: 4.9,
          totalAmount: 9850.0,
          items: [
            { id: 'kit-e-1', itemNo: 'E.1', description: 'Under-cabinet high-CRI continuous LED linear profile light and IP54 ceiling downlights', quantity: 1.0, unit: 'Sets', rate: 9850.0, amount: 9850.0, studioDrawingRef: 'DWG-KIT-LT-01' }
          ]
        },
        F: {
          id: 'ann-kit-f',
          tradeCode: 'F',
          tradeName: 'Carpentry & Modular Kitchen',
          tradeCategory: 'Carpentry',
          assignedVendorId: 'ven-wood-1',
          assignedVendorName: 'MasterCraft Custom Joinery & Millwork',
          vendorRating: 5.0,
          totalAmount: 150115.0,
          items: [
            { id: 'kit-f-1', itemNo: 'F.1', description: 'Acrylic finished BWP 710 marine ply modular kitchen base & overhead cabinets with Blum soft-close tandem boxes', quantity: 1.0, unit: 'Lumpsum', rate: 150115.0, amount: 150115.0, studioDrawingRef: 'DWG-KIT-CARP-01' }
          ]
        },
        G: {
          id: 'ann-kit-g',
          tradeCode: 'G',
          tradeName: 'Paint & Polish Work',
          tradeCategory: 'Paint & Polish',
          assignedVendorId: 'ven-paint-1',
          assignedVendorName: 'Royale Finishes & Polish Works',
          vendorRating: 4.8,
          totalAmount: 3922.0,
          items: [
            { id: 'kit-g-1', itemNo: 'G.1', description: 'Stain-resistant washable kitchen acrylic paint for ceiling and exposed wall sections', quantity: 109.0, unit: 'Sq.Ft', rate: 35.98, amount: 3922.0, studioDrawingRef: 'DWG-KIT-PNT-01' }
          ]
        },
        H: {
          id: 'ann-kit-h',
          tradeCode: 'H',
          tradeName: 'Miscellaneous Work',
          tradeCategory: 'Miscellaneous',
          assignedVendorId: 'ven-misc-1',
          assignedVendorName: 'Heritage Decor & Specialist Works',
          vendorRating: 4.6,
          totalAmount: 37500.0,
          items: [
            { id: 'kit-h-1', itemNo: 'H.1', description: 'Hafele SS304 kitchen sink, pull-out spring mixer faucet and soap dispenser', quantity: 1.0, unit: 'Sets', rate: 37500.0, amount: 37500.0, studioDrawingRef: 'DWG-KIT-MISC-01' }
          ]
        },
        I: {
          id: 'ann-kit-i',
          tradeCode: 'I',
          tradeName: 'Loose Furniture Work',
          tradeCategory: 'Loose Furniture',
          assignedVendorId: 'ven-furn-1',
          assignedVendorName: 'Artefact Luxury Loose Furniture',
          vendorRating: 4.9,
          totalAmount: 45000.0,
          items: [
            { id: 'kit-i-1', itemNo: 'I.1', description: 'Breakfast counter bar stools in leatherette with gas lift swivel base', quantity: 2.0, unit: 'Nos', rate: 22500.0, amount: 45000.0, studioDrawingRef: 'DWG-KIT-FURN-01' }
          ]
        },
        J: {
          id: 'ann-kit-j',
          tradeCode: 'J',
          tradeName: 'Aluminium Sliding Window Work',
          tradeCategory: 'Aluminium Windows',
          assignedVendorId: 'ven-alum-1',
          assignedVendorName: 'Jindal Fenestration & Glass Tech',
          vendorRating: 4.7,
          totalAmount: 6806.25,
          items: [
            { id: 'kit-j-1', itemNo: 'J.1', description: 'Jindal kitchen sliding service window with insect screen and heavy rollers', quantity: 14.0, unit: 'Sq.Ft', rate: 486.16, amount: 6806.25, studioDrawingRef: 'DWG-KIT-WIN-01' }
          ]
        }
      }
    },
    {
      roomId: 'room-utility',
      roomName: 'Utility Area',
      roomType: 'Utility',
      dimensionSpec: {
        lengthFeet: 7,
        lengthInches: 9,
        widthFeet: 4,
        widthInches: 9,
        carpetAreaSqFt: 37.0,
        perimeterRFt: 25.0,
        lintelHeight: "7'-0\"",
        doorSize: "2'-6\"",
        windowCill: "3'-6\"",
        windowHeight: "3'-6\"",
        windowAbove: "1'-0\"",
        windowLength: "3'-0\"",
        beamHeight: "1'-0\"",
        clearHeight: "8'-6\""
      },
      totalRoomAmount: 444049.5,
      ratePerSqFt: 12001.34,
      percentageOfProject: 4.54,
      annexures: {
        A: {
          id: 'ann-ut-a',
          tradeCode: 'A',
          tradeName: 'Civil & Plumbing Work',
          tradeCategory: 'Civil',
          assignedVendorId: 'ven-civil-1',
          assignedVendorName: 'Apex Civil Infra & Masonry',
          vendorRating: 4.9,
          totalAmount: 223510.5,
          items: [
            { id: 'ut-a-1', itemNo: 'A.1', description: 'Heavy-duty non-skid floor tiles, dado tile cladding, washing machine inlet/outlet lines and floor trap', quantity: 1.0, unit: 'Lumpsum', rate: 223510.5, amount: 223510.5, studioDrawingRef: 'DWG-UT-CIV-01' }
          ]
        },
        B: {
          id: 'ann-ut-b',
          tradeCode: 'B',
          tradeName: 'Plaster of Paris Work',
          tradeCategory: 'POP',
          assignedVendorId: 'ven-pop-1',
          assignedVendorName: 'Gyprock & Elite False Ceilings',
          vendorRating: 4.8,
          totalAmount: 0.0,
          items: []
        },
        C: {
          id: 'ann-ut-c',
          tradeCode: 'C',
          tradeName: 'Electric Wiring Work',
          tradeCategory: 'Electric Wiring',
          assignedVendorId: 'ven-elec-1',
          assignedVendorName: 'Voltech Smart MEP & Power Systems',
          vendorRating: 4.9,
          totalAmount: 5452.0,
          items: [
            { id: 'ut-c-1', itemNo: 'C.1', description: 'Heavy power circuits for washing machine, dryer and utility water heater', quantity: 1.0, unit: 'Lumpsum', rate: 5452.0, amount: 5452.0, studioDrawingRef: 'DWG-UT-EL-01' }
          ]
        },
        D: {
          id: 'ann-ut-d',
          tradeCode: 'D',
          tradeName: 'Electric Switches',
          tradeCategory: 'Electric Switches',
          assignedVendorId: 'ven-switch-1',
          assignedVendorName: 'Schneider & Legrand Modular Hub',
          vendorRating: 4.7,
          totalAmount: 3580.0,
          items: [
            { id: 'ut-d-1', itemNo: 'D.1', description: 'Weatherproof 20A industrial sockets and DP switch unit', quantity: 1.0, unit: 'Sets', rate: 3580.0, amount: 3580.0, studioDrawingRef: 'DWG-UT-SW-01' }
          ]
        },
        E: {
          id: 'ann-ut-e',
          tradeCode: 'E',
          tradeName: 'Electric Fixtures',
          tradeCategory: 'Electric Fixtures',
          assignedVendorId: 'ven-light-1',
          assignedVendorName: 'Lumina Architectural Illumination',
          vendorRating: 4.9,
          totalAmount: 5610.0,
          items: [
            { id: 'ut-e-1', itemNo: 'E.1', description: 'Moisture-resistant LED utility luminaire fixture', quantity: 1.0, unit: 'Sets', rate: 5610.0, amount: 5610.0, studioDrawingRef: 'DWG-UT-LT-01' }
          ]
        },
        F: {
          id: 'ann-ut-f',
          tradeCode: 'F',
          tradeName: 'Carpentry Work',
          tradeCategory: 'Carpentry',
          assignedVendorId: 'ven-wood-1',
          assignedVendorName: 'MasterCraft Custom Joinery & Millwork',
          vendorRating: 5.0,
          totalAmount: 202510.0,
          items: [
            { id: 'ut-f-1', itemNo: 'F.1', description: 'Louvered waterproof shutters for washing machine enclosure, broom storage and overhead detergent cabinet', quantity: 1.0, unit: 'Lumpsum', rate: 202510.0, amount: 202510.0, studioDrawingRef: 'DWG-UT-CARP-01' }
          ]
        },
        G: {
          id: 'ann-ut-g',
          tradeCode: 'G',
          tradeName: 'Paint & Polish Work',
          tradeCategory: 'Paint & Polish',
          assignedVendorId: 'ven-paint-1',
          assignedVendorName: 'Royale Finishes & Polish Works',
          vendorRating: 4.8,
          totalAmount: 962.0,
          items: [
            { id: 'ut-g-1', itemNo: 'G.1', description: 'Anti-fungal acrylic exterior grade paint on exposed ceiling', quantity: 37.0, unit: 'Sq.Ft', rate: 26.0, amount: 962.0, studioDrawingRef: 'DWG-UT-PNT-01' }
          ]
        },
        H: {
          id: 'ann-ut-h',
          tradeCode: 'H',
          tradeName: 'Miscellaneous Work',
          tradeCategory: 'Miscellaneous',
          assignedVendorId: 'ven-misc-1',
          assignedVendorName: 'Heritage Decor & Specialist Works',
          vendorRating: 4.6,
          totalAmount: 1000.0,
          items: [
            { id: 'ut-h-1', itemNo: 'H.1', description: 'Stainless steel utility bib cock tap & floor drain grating', quantity: 1.0, unit: 'Sets', rate: 1000.0, amount: 1000.0, studioDrawingRef: 'DWG-UT-MISC-01' }
          ]
        },
        I: {
          id: 'ann-ut-i',
          tradeCode: 'I',
          tradeName: 'Loose Furniture Work',
          tradeCategory: 'Loose Furniture',
          assignedVendorId: 'ven-furn-1',
          assignedVendorName: 'Artefact Luxury Loose Furniture',
          vendorRating: 4.9,
          totalAmount: 0.0,
          items: []
        },
        J: {
          id: 'ann-ut-j',
          tradeCode: 'J',
          tradeName: 'Aluminium Sliding Window Work',
          tradeCategory: 'Aluminium Windows',
          assignedVendorId: 'ven-alum-1',
          assignedVendorName: 'Jindal Fenestration & Glass Tech',
          vendorRating: 4.7,
          totalAmount: 1425.0,
          items: [
            { id: 'ut-j-1', itemNo: 'J.1', description: 'Aluminum louvered exhaust window frame with exhaust cut-out', quantity: 1.0, unit: 'Sets', rate: 1425.0, amount: 1425.0, studioDrawingRef: 'DWG-UT-WIN-01' }
          ]
        }
      }
    }
  ]
};

