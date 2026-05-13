DO $$
DECLARE
  uid uuid;
BEGIN
  SELECT id INTO uid FROM auth.users WHERE email = 'admin@premiumstroe.ru' LIMIT 1;

  IF uid IS NULL THEN
    uid := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'admin@premiumstroe.ru', crypt('premium.admin7', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id,
      created_at, updated_at, last_sign_in_at
    ) VALUES (
      gen_random_uuid(), uid,
      jsonb_build_object('sub', uid::text, 'email', 'admin@premiumstroe.ru'),
      'email', uid::text, now(), now(), now()
    );
  ELSE
    UPDATE auth.users
    SET encrypted_password = crypt('premium.admin7', gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        updated_at = now()
    WHERE id = uid;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (uid, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;