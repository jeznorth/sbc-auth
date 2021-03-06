<template>
  <v-data-table
    class="user-list"
    :headers="headerInvitations"
    :items="indexedInvitations"
    :items-per-page="5"
    :calculate-widths="true"
    :hide-default-footer="indexedInvitations.length <= 5"
    :no-data-text="$t('noPendingInvitesLabel')"
  >
    <template v-slot:item.recipientEmail="{ item }" >
      <span :data-test="getIndexedTag('invitation-email', item.index)">{{ item.recipientEmail }}</span>
    </template>
    <template v-slot:item.sentDate="{ item }">
      <span :data-test="getIndexedTag('invitation-sent', item.index)">{{ formatDate (item.sentDate) }}</span>
    </template>
    <template v-slot:item.expiresOn="{ item }">
      <span :data-test="getIndexedTag('invitation-expires', item.index)">{{ formatDate (item.expiresOn) }}</span>
    </template>
    <template v-slot:item.action="{ item }">
      <v-btn :data-test="getIndexedTag('resend-button', item.index)" small color="primary" class="mr-2" @click="resend(item)">Resend</v-btn>
      <v-btn :data-test="getIndexedTag('remove-button', item.index)" depressed small @click="confirmRemoveInvite(item)">Remove</v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator'
import { mapActions, mapState } from 'vuex'
import { Invitation } from '@/models/Invitation'
import moment from 'moment'

@Component({
  computed: {
    ...mapState('org', ['pendingOrgInvitations'])
  },
  methods: {
    ...mapActions('org', ['syncPendingOrgInvitations'])
  }
})
export default class InvitationsDataTable extends Vue {
  private readonly pendingOrgInvitations!: Invitation[]
  private readonly syncPendingOrgInvitations!: () => Invitation[]
  private readonly headerInvitations = [
    {
      text: 'Email',
      align: 'left',
      sortable: true,
      value: 'recipientEmail'
    },
    {
      text: 'Invitation Sent',
      align: 'left',
      sortable: true,
      value: 'sentDate'
    },
    {
      text: 'Expires',
      align: 'left',
      sortable: true,
      value: 'expiresOn'
    },
    {
      text: 'Actions',
      align: 'left',
      value: 'action',
      sortable: false,
      width: '193'
    }
  ]

  private async mounted () {
    await this.syncPendingOrgInvitations()
  }

  private formatDate (date: Date) {
    return moment(date).format('DD MMM, YYYY')
  }

  private getIndexedTag (tag, index): string {
    return `${tag}-${index}`
  }

  private get indexedInvitations () {
    return this.pendingOrgInvitations.map((item, index) => ({
      index,
      ...item
    }))
  }

  @Emit()
  private confirmRemoveInvite (invititation: Invitation) {}

  @Emit()
  private resend (invitation: Invitation) {}
}
</script>
